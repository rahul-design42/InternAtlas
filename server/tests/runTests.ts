import assert from 'assert';
process.env.JWT_SECRET = 'testsecret_testsecret_testsecret';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app';
import { User, Organization, OrganizationMember, Opportunity, Application, Profile } from '../src/models';
import { config } from '../src/config/env';
import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';

const generateToken = (payload: any) => {
  return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: '1h' });
};

let mongoServer: MongoMemoryServer;

async function setup() {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
  await Promise.all([
    User.deleteMany({}),
    Organization.deleteMany({}),
    OrganizationMember.deleteMany({}),
    Opportunity.deleteMany({}),
    Application.deleteMany({}),
    Profile.deleteMany({})
  ]);
}

async function teardown() {
  await mongoose.connection.close();
  if (mongoServer) {
    await mongoServer.stop();
  }
}

async function runTests() {
  try {
    await setup();
    console.log('--- Database cleared and connected ---');

    // 1. Create Users
    const candidateA = await User.create({ email: 'candA@test.com', passwordHash: 'hash', role: 'CANDIDATE', isVerified: true });
    const candidateB = await User.create({ email: 'candB@test.com', passwordHash: 'hash', role: 'CANDIDATE', isVerified: true });
    const recruiterA = await User.create({ email: 'recA@test.com', passwordHash: 'hash', role: 'RECRUITER', isVerified: true });
    const adminA = await User.create({ email: 'adminA@test.com', passwordHash: 'hash', role: 'ADMIN', isVerified: true });

    const candAToken = generateToken({ id: candidateA._id, role: candidateA.role, email: candidateA.email });
    const candBToken = generateToken({ id: candidateB._id, role: candidateB.role, email: candidateB.email });
    const adminToken = generateToken({ id: adminA._id, role: adminA.role, email: adminA.email });

    // 2. Setup Organizations
    const orgA = await Organization.create({ name: 'Org A', slug: 'org-a', verificationStatus: 'VERIFIED' });
    const orgB = await Organization.create({ name: 'Org B', slug: 'org-b', verificationStatus: 'VERIFIED' });

    await OrganizationMember.create({ organizationId: orgA._id, userId: recruiterA._id, role: 'OWNER', status: 'ACTIVE' });
    const recAToken = generateToken({ id: recruiterA._id, role: recruiterA.role, email: recruiterA.email });

    // ==========================================
    // TEST C: Admin role isolation
    // ==========================================
    console.log('Running Test C: Admin role isolation...');
    const adminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${candAToken}`);
    assert.strictEqual(adminRes.status, 403, 'Candidate should not access admin endpoints');

    const recAdminRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${recAToken}`);
    assert.strictEqual(recAdminRes.status, 403, 'Recruiter should not access admin endpoints');

    const adminAllowedRes = await request(app)
      .get('/api/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);
    assert.strictEqual(adminAllowedRes.status, 200, 'Admin should access admin endpoints');
    
    // ==========================================
    // TEST A: Candidate Isolation
    // ==========================================
    console.log('Running Test A: Candidate Isolation...');
    await Profile.create({ userId: candidateA._id, firstName: 'Alice', lastName: 'A', username: 'alice_a' });
    
    const profRes = await request(app)
      .get('/api/candidate/profile')
      .set('Authorization', `Bearer ${candBToken}`);
    assert.ok(!profRes.body.data || profRes.body.data.userId !== candidateA._id.toString(), 'Candidate B cannot access Candidate A profile');

    // ==========================================
    // TEST B: Recruiter Organization Isolation
    // ==========================================
    console.log('Running Test B: Recruiter Organization Isolation...');
    const oppB = await Opportunity.create({
      title: 'Opp B',
      slug: 'opp-b',
      organizationId: orgB._id,
      createdBy: adminA._id,
      type: 'INTERNSHIP',
      location: 'Remote',
      workMode: 'REMOTE',
      description: 'Desc',
      status: 'PUBLISHED'
    });

    const readOppRes = await request(app)
      .get(`/api/recruiter/opportunities/${oppB._id}`)
      .set('Authorization', `Bearer ${recAToken}`);
    assert.strictEqual(readOppRes.status, 404, 'Recruiter A cannot view Organization B opportunities');

    const updateOppRes = await request(app)
      .put(`/api/recruiter/opportunities/${oppB._id}`)
      .set('Authorization', `Bearer ${recAToken}`)
      .send({ title: 'Hacked' });
    assert.strictEqual(updateOppRes.status, 404, 'Recruiter A cannot modify Organization B opportunities');

    // ==========================================
    // TEST D: ID Manipulation
    // ==========================================
    console.log('Running Test D: ID Manipulation...');
    const createOppRes = await request(app)
      .post('/api/recruiter/opportunities')
      .set('Authorization', `Bearer ${recAToken}`)
      .send({
        title: 'New Opp',
        type: 'INTERNSHIP',
        location: 'Remote',
        workMode: 'REMOTE',
        description: 'Test',
        organizationId: orgB._id // Try to manipulate
      });
    
    assert.strictEqual(createOppRes.status, 201);
    assert.strictEqual(createOppRes.body.data.organizationId.toString(), orgA._id.toString(), 'Opportunity must be created under Recruiter\'s organization');

    // Setup Application for Candidate A in Org A
    const appA = await Application.create({
      candidateId: candidateA._id,
      opportunityId: createOppRes.body.data._id,
      organizationId: orgA._id,
      answers: [],
      status: 'SUBMITTED'
    });

    // ==========================================
    // TEST E: Conversation Isolation
    // ==========================================
    console.log('Running Test E: Conversation Isolation...');
    const candBConvRes = await request(app)
      .get(`/api/candidate/applications/${appA._id}/conversation`)
      .set('Authorization', `Bearer ${candBToken}`);
    assert.strictEqual(candBConvRes.status, 404, 'Candidate B cannot access Candidate A conversation');

    // Cand A creates conversation
    const candMsgRes = await request(app)
      .post(`/api/candidate/applications/${appA._id}/messages`)
      .set('Authorization', `Bearer ${candAToken}`)
      .send({ body: 'Hello Recruiter' });
    assert.strictEqual(candMsgRes.status, 201);
    const conversationId = candMsgRes.body.data.conversationId;

    // Recruiter from Org B tries to access it
    const recB = await User.create({ email: 'recB@test.com', passwordHash: 'hash', role: 'RECRUITER', isVerified: true });
    await OrganizationMember.create({ organizationId: orgB._id, userId: recB._id, role: 'OWNER', status: 'ACTIVE' });
    const recBToken = generateToken({ id: recB._id, role: recB.role, email: recB.email });

    const recBConvRes = await request(app)
      .get(`/api/recruiter/applications/${appA._id}/conversation`)
      .set('Authorization', `Bearer ${recBToken}`);
    assert.strictEqual(recBConvRes.status, 404, 'Recruiter B cannot access Org A application conversation');

    // ==========================================
    // TEST F: Message Authorization
    // ==========================================
    console.log('Running Test F: Message Authorization...');
    
    // Cand B tries to read messages
    const candBReadRes = await request(app)
      .get(`/api/candidate/conversations/${conversationId}/messages`)
      .set('Authorization', `Bearer ${candBToken}`);
    assert.strictEqual(candBReadRes.status, 404);

    // Cand B tries to send message
    // Wait, cand send endpoint uses applicationId, not conversationId. 
    // If Cand B uses appA._id, it will 404. Let's verify.
    const candBSendRes = await request(app)
      .post(`/api/candidate/applications/${appA._id}/messages`)
      .set('Authorization', `Bearer ${candBToken}`)
      .send({ body: 'Hacked' });
    assert.strictEqual(candBSendRes.status, 404);

    // Recruiter B tries to send message
    const recBSendRes = await request(app)
      .post(`/api/recruiter/applications/${appA._id}/messages`)
      .set('Authorization', `Bearer ${recBToken}`)
      .send({ body: 'Hacked' });
    assert.strictEqual(recBSendRes.status, 404);

    // ==========================================
    // TEST G: Interview Authorization
    // ==========================================
    console.log('Running Test G: Interview Authorization...');
    
    const interviewRes = await request(app)
      .post(`/api/recruiter/applications/${appA._id}/interviews`)
      .set('Authorization', `Bearer ${recAToken}`)
      .send({ startAt: new Date(Date.now() + 86400000), endAt: new Date(Date.now() + 90000000), timezone: 'UTC' });
    assert.strictEqual(interviewRes.status, 201);
    const interviewId = interviewRes.body.data._id;

    // Cand B attempts to accept interview
    const candBAcceptRes = await request(app)
      .put(`/api/candidate/interviews/${interviewId}/respond`)
      .set('Authorization', `Bearer ${candBToken}`)
      .send({ status: 'ACCEPTED' });
    assert.strictEqual(candBAcceptRes.status, 403, 'Candidate B cannot accept Candidate A interview');

    // ==========================================
    // TEST H: Invalid interview transitions
    // ==========================================
    console.log('Running Test H: Invalid interview transitions...');
    
    // Cand A declines
    const candADeclineRes = await request(app)
      .put(`/api/candidate/interviews/${interviewId}/respond`)
      .set('Authorization', `Bearer ${candAToken}`)
      .send({ status: 'DECLINED' });
    assert.strictEqual(candADeclineRes.status, 200);

    // Cand A attempts to accept the declined interview
    const candAAcceptDeclinedRes = await request(app)
      .put(`/api/candidate/interviews/${interviewId}/respond`)
      .set('Authorization', `Bearer ${candAToken}`)
      .send({ status: 'ACCEPTED' });
    assert.strictEqual(candAAcceptDeclinedRes.status, 409, 'Cannot transition from DECLINED to ACCEPTED');

    // ==========================================
    // TEST I: Invalid message payload
    // ==========================================
    console.log('Running Test I: Invalid message payload...');
    const emptyMsgRes = await request(app)
      .post(`/api/candidate/applications/${appA._id}/messages`)
      .set('Authorization', `Bearer ${candAToken}`)
      .send({ body: '   ' });
    assert.strictEqual(emptyMsgRes.status, 400);

    const longMsgRes = await request(app)
      .post(`/api/candidate/applications/${appA._id}/messages`)
      .set('Authorization', `Bearer ${candAToken}`)
      .send({ body: 'A'.repeat(5001) });
    assert.strictEqual(longMsgRes.status, 400);

    // ==========================================
    // TEST J: Notification recipient correctness
    // ==========================================
    console.log('Running Test J: Notification recipient correctness...');
    // We already verified via logs that it dispatches, but let's check DB directly
    const { Notification } = require('../src/models');
    const recNotifs = await Notification.find({ userId: recruiterA._id, type: 'NEW_MESSAGE' });
    // Since Cand A sent a message, Recruiter A (if known) should get it, but Cand A's message creation might not have had a recruiterId yet because recruiter hadn't sent anything.
    // Let's have recruiter send a message, then Cand A reply.
    await request(app).post(`/api/recruiter/applications/${appA._id}/messages`).set('Authorization', `Bearer ${recAToken}`).send({ body: 'Hello' });
    
    const notifsForCand = await Notification.find({ userId: candidateA._id, type: 'NEW_MESSAGE' });
    assert.ok(notifsForCand.length >= 1, 'Candidate A should have a notification');

    const notifsForCandB = await Notification.find({ userId: candidateB._id, type: 'NEW_MESSAGE' });
    assert.strictEqual(notifsForCandB.length, 0, 'Candidate B should have no notifications');

    // ==========================================
    // TEST K: Interview time validation
    // ==========================================
    console.log('Running Test K: Interview time validation...');
    const invalidTimeRes = await request(app)
      .post(`/api/recruiter/applications/${appA._id}/interviews`)
      .set('Authorization', `Bearer ${recAToken}`)
      .send({ startAt: new Date(Date.now() + 90000000), endAt: new Date(Date.now() + 86400000), timezone: 'UTC' }); // End before Start
    assert.strictEqual(invalidTimeRes.status, 400, 'Start time must be before end time');

    console.log('\n✅ ALL AUTOMATED SECURITY TESTS PASSED');
    await teardown();
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error);
    await teardown();
    process.exit(1);
  }
}

runTests();
