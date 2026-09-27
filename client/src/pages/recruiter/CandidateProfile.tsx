import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Briefcase, GraduationCap, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';

const CandidateProfile = () => {
  const { candidateId } = useParams<{ candidateId: string }>();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['candidate-profile', candidateId],
    queryFn: async () => {
      const res = await api.get(`/recruiter/candidates/${candidateId}/profile`);
      return res.data.data;
    },
    retry: false
  });

  if (isLoading) return <div className="p-8">Loading candidate profile...</div>;

  if (isError || !profile) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-error mb-2">Access Denied</h2>
        <p className="text-text-secondary">You do not have permission to view this profile, or the candidate has not set up their profile.</p>
        <Link to={-1 as any} className="text-primary mt-4 inline-block hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <Link to={-1 as any} className="inline-flex items-center text-text-secondary hover:text-primary transition-colors text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </Link>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-8">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-3xl font-bold text-primary absolute -top-12">
            {profile.firstName?.charAt(0)}{profile.lastName?.charAt(0)}
          </div>
          
          <div className="mt-16 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">{profile.firstName} {profile.lastName}</h1>
              <p className="text-text-secondary text-lg mt-1">{profile.headline || 'Candidate'}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-text-muted">
                {profile.location && (
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {profile.location}</span>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4 mr-1" /> Portfolio
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors">
                    GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary transition-colors">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            <div>
              <button className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors">
                Contact Candidate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          {/* Bio */}
          {profile.bio && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-4">About</h3>
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-primary" /> Experience
              </h3>
              <div className="space-y-6">
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-surface-secondary">
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2"></div>
                    <h4 className="font-bold text-text-primary">{exp.title}</h4>
                    <p className="text-sm font-medium text-text-secondary">{exp.company}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : '')}
                    </p>
                    {exp.description && <p className="mt-3 text-sm text-text-secondary leading-relaxed">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-6 flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-secondary" /> Education
              </h3>
              <div className="space-y-6">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-surface-secondary">
                    <div className="absolute w-3 h-3 bg-secondary rounded-full -left-[7px] top-2"></div>
                    <h4 className="font-bold text-text-primary">{edu.institution}</h4>
                    <p className="text-sm font-medium text-text-secondary">{edu.degree} in {edu.fieldOfStudy}</p>
                    <p className="text-xs text-text-muted mt-1">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                    </p>
                    {edu.grade && <p className="mt-2 text-sm font-medium text-text-primary">Grade: {edu.grade}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-lg font-bold text-text-primary mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any) => (
                  <span key={skill._id} className="bg-surface-secondary text-text-primary px-3 py-1 rounded-full text-sm font-medium border border-border">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
