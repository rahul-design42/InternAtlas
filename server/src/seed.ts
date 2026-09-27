import mongoose from 'mongoose';
import { config } from './config/env';
import { User, Organization, Opportunity, Skill } from './models';

async function seed() {
  console.log('Connecting to MongoDB at:', config.mongoUri);
  await mongoose.connect(config.mongoUri);

  // 1. Create or find admin user
  let admin = await User.findOne({ email: 'admin@internatlas.com' });
  if (!admin) {
    admin = await User.create({
      email: 'admin@internatlas.com',
      passwordHash: '$2a$10$wK1FmXy3v4y5Z6.exampleHashValueHere',
      role: 'ADMIN',
      emailVerified: true,
    });
  }

  // 2. Create Skills
  const skillNames = [
    'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Python', 'PyTorch', 
    'LangChain', 'Transformers', 'FastAPI', 'Docker', 'AWS', 'NetSec', 
    'OWASP', 'Linux', 'Figma', 'Design Systems', 'Prototyping', 'User Testing', 
    'Golang', 'PostgreSQL', 'SQL', 'Pandas', 'Tableau', 'JavaScript'
  ];

  const skillDocs: Record<string, any> = {};
  for (const name of skillNames) {
    let skill = await Skill.findOne({ name });
    if (!skill) {
      skill = await Skill.create({ name, slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-') });
    }
    skillDocs[name] = skill._id;
  }

  // 3. Create Organizations
  const orgsData: any[] = [
    {
      name: 'NovaTech Labs',
      slug: 'novatech-labs',
      verificationStatus: 'VERIFIED',
      description: 'Venture-backed AI & Developer Tools Ecosystem',
      website: 'https://novatechlabs.dev',
      industry: 'Software & Dev Tools',
      companySize: '25-50 Employees',
      location: 'Bengaluru, India (Remote-first)',
    },
    {
      name: 'DataForge AI',
      slug: 'dataforge-ai',
      verificationStatus: 'VERIFIED',
      description: 'Enterprise AI and machine learning infrastructure platforms',
      website: 'https://dataforge.ai',
      industry: 'Artificial Intelligence',
      companySize: '50-100 Employees',
      location: 'Bangalore, India',
    },
    {
      name: 'SecureStack',
      slug: 'securestack',
      verificationStatus: 'VERIFIED',
      description: 'Automated application security and cloud compliance tooling',
      website: 'https://securestack.io',
      industry: 'Cybersecurity',
      companySize: '15-30 Employees',
      location: 'Remote',
    },
    {
      name: 'PixelWorks Studio',
      slug: 'pixelworks-studio',
      verificationStatus: 'VERIFIED',
      description: 'High-craft product design, design systems, and frontend interaction engineering',
      website: 'https://pixelworks.design',
      industry: 'Design & Interactive Media',
      companySize: '20-40 Employees',
      location: 'Hyderabad, India',
    },
    {
      name: 'CloudMatrix Systems',
      slug: 'cloudmatrix-systems',
      verificationStatus: 'VERIFIED',
      description: 'Next-gen distributed cloud infrastructure and observability engines',
      website: 'https://cloudmatrix.dev',
      industry: 'Cloud Infrastructure',
      companySize: '100-250 Employees',
      location: 'Gurgaon, India',
    },
    {
      name: 'HealthPulse Analytics',
      slug: 'healthpulse-analytics',
      verificationStatus: 'VERIFIED',
      description: 'Clinical data science and predictive healthcare telemetry',
      website: 'https://healthpulse.ai',
      industry: 'HealthTech & Data Science',
      companySize: '30-60 Employees',
      location: 'Delhi NCR, India',
    },
  ];

  const orgDocs: Record<string, any> = {};
  for (const orgData of orgsData) {
    let org = await Organization.findOne({ slug: orgData.slug });
    if (!org) {
      org = await Organization.create(orgData);
    } else {
      await Organization.updateOne({ slug: orgData.slug }, { $set: orgData });
    }
    orgDocs[orgData.name] = org._id;
  }

  // 4. Create Opportunities
  const oppsData: any[] = [
    {
      title: 'Frontend Development Intern',
      slug: 'frontend-development-intern-novatech-labs',
      organizationId: orgDocs['NovaTech Labs'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'REMOTE',
      location: 'Remote • Pan-India',
      duration: '3 Months',
      stipend: '₹20,000 / month',
      skills: [skillDocs['React'], skillDocs['TypeScript'], skillDocs['Tailwind CSS'], skillDocs['Next.js']],
      description:
        'NovaTech Labs is on an ambitious mission to redefine developer experience by building AI-native workspace tools, intelligent code generation pipelines, and ultra-responsive IDE dashboards. As our Frontend Development Intern, you will join the core product engineering pod in Bengaluru (operating remotely) to work directly on client-facing applications used by thousands of engineering teams.',
      requirements: [
        'Strong conceptual foundations in HTML5 semantics, modern CSS3 layout dynamics (Grid, Flexbox), and ES6+ JavaScript.',
        'Hands-on command of TypeScript and state management paradigms (Zustand, TanStack Query, or Redux Toolkit).',
        'Practical familiarity with Git branching models, collaborative PR workflows, and asynchronous RESTful or GraphQL endpoints.',
      ],
      responsibilities: [
        'Build, optimize, and ship highly responsive web interfaces using React 18, Next.js, and TypeScript.',
        'Collaborate closely with product designers to translate complex Figma design systems into scalable, semantic Tailwind CSS tokens.',
        'Tune client-side performance, prioritize Core Web Vitals, and manage smart browser caching for low-latency streaming UIs.',
      ],
      benefits: [
        '1-on-1 Mentorship directly from Senior Staff Engineers.',
        'PPO Opportunity with high potential for full-time conversion offer (₹8–12 LPA).',
        'Cryptographically verifiable certificate of completion and signed executive recommendation.',
      ],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Machine Learning Research Intern',
      slug: 'machine-learning-research-intern-dataforge-ai',
      organizationId: orgDocs['DataForge AI'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'HYBRID',
      location: 'Bangalore (Hybrid)',
      duration: '6 Months',
      stipend: '₹35,000 / month',
      skills: [skillDocs['Python'], skillDocs['PyTorch'], skillDocs['LangChain'], skillDocs['Transformers']],
      description:
        'DataForge AI is looking for an ML Research Intern to train domain-adapted embeddings and evaluate low-latency LLM quantization pipelines.',
      requirements: ['Solid Python programming skills', 'Experience with PyTorch or TensorFlow', 'Deep understanding of Transformer architectures'],
      responsibilities: ['Benchmark model inference speeds', 'Implement evaluation metrics', 'Collaborate on research papers and production deployments'],
      benefits: ['High stipend (₹35k/mo)', 'Direct mentorship from PhD researchers', 'Access to multi-GPU clusters'],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Cybersecurity Analyst Intern',
      slug: 'cybersecurity-analyst-intern-securestack',
      organizationId: orgDocs['SecureStack'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'REMOTE',
      location: 'Remote',
      duration: '4 Months',
      stipend: '₹18,000 / month',
      skills: [skillDocs['NetSec'], skillDocs['OWASP'], skillDocs['Linux'], skillDocs['Python']],
      description:
        'SecureStack is hiring an intern to perform static application security testing (SAST), vulnerability triage, and automated security scanning.',
      requirements: ['Knowledge of OWASP Top 10', 'Basic Linux server administration', 'Scripting with Python or Bash'],
      responsibilities: ['Assist in vulnerability assessments', 'Develop custom scanning rules', 'Audit open-source dependencies'],
      benefits: ['Stipend ₹18,000/mo', 'Hands-on exposure to cloud security', 'Certification reimbursement support'],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Product Design (UI/UX) Intern',
      slug: 'product-design-intern-pixelworks-studio',
      organizationId: orgDocs['PixelWorks Studio'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'ON_SITE',
      location: 'Hyderabad (On-site)',
      duration: '3 Months',
      stipend: '₹22,000 / month',
      skills: [skillDocs['Figma'], skillDocs['Design Systems'], skillDocs['Prototyping'], skillDocs['User Testing']],
      description:
        'Join PixelWorks Studio to design stunning design tokens, micro-interactions, mobile flows, and interactive web components.',
      requirements: ['Strong portfolio of UI/UX case studies', 'Mastery of Figma components and auto-layout', 'Basic understanding of HTML/CSS constraints'],
      responsibilities: ['Create high-fidelity wireframes and interactive prototypes', 'Maintain and evolve design systems', 'Conduct user interviews and testing'],
      benefits: ['₹22,000/mo stipend', 'Design team mentorship', 'Live product showcase for portfolio'],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(),
    },
    {
      title: 'Backend Engineering Intern (Go/Node)',
      slug: 'backend-engineering-intern-cloudmatrix',
      organizationId: orgDocs['CloudMatrix Systems'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'REMOTE',
      location: 'Remote',
      duration: '6 Months',
      stipend: '₹25,000 / month',
      skills: [skillDocs['Golang'], skillDocs['PostgreSQL'], skillDocs['Docker'], skillDocs['AWS']],
      description:
        'CloudMatrix Systems is seeking a backend engineering intern to design microservices, optimize SQL queries, and scale containerized APIs.',
      requirements: ['Experience with Go, Node.js, or Python', 'Familiarity with relational databases (PostgreSQL)', 'Understanding of RESTful API principles'],
      responsibilities: ['Build backend API endpoints', 'Write database migrations and unit tests', 'Monitor distributed telemetry and error logs'],
      benefits: ['₹25,000/mo stipend', 'High retention / PPO pathway', 'Production microservices experience'],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Data Science & Analytics Intern',
      slug: 'data-science-analytics-intern-healthpulse',
      organizationId: orgDocs['HealthPulse Analytics'],
      createdBy: admin._id,
      type: 'INTERNSHIP',
      workMode: 'HYBRID',
      location: 'Gurgaon (Hybrid)',
      duration: '3 Months',
      stipend: '₹16,000 / month',
      skills: [skillDocs['SQL'], skillDocs['Python'], skillDocs['Pandas'], skillDocs['Tableau']],
      description:
        'HealthPulse Analytics seeks a Data Science Intern to clean clinical datasets, build predictive regression models, and visualize business dashboards.',
      requirements: ['Proficiency with SQL and Python', 'Hands-on experience with Pandas and NumPy', 'Curious, analytical problem-solving mindset'],
      responsibilities: ['Extract and validate raw clinical data', 'Build automated pipeline transformations', 'Deliver executive insights in Tableau'],
      benefits: ['₹16,000/mo stipend', 'Healthcare domain expertise', 'Flexible hybrid schedule'],
      applicationMethod: 'INTERNAL',
      status: 'PUBLISHED',
      isVerified: true,
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const opp of oppsData) {
    const existing = await Opportunity.findOne({ slug: opp.slug });
    if (!existing) {
      await Opportunity.create(opp);
      console.log('Created opportunity:', opp.title);
    } else {
      await Opportunity.updateOne({ slug: opp.slug }, { $set: opp });
      console.log('Updated opportunity:', opp.title);
    }
  }

  const count = await Opportunity.countDocuments({ status: 'PUBLISHED' });
  console.log(`\nSeed successful! Total published opportunities in DB: ${count}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
