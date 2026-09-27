import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import api from '../../lib/axios';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  education: z.array(z.object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().min(1, 'Degree is required'),
    fieldOfStudy: z.string().min(1, 'Field of study is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    currentlyStudying: z.boolean().optional()
  })).optional(),
  experience: z.array(z.object({
    company: z.string().min(1, 'Company is required'),
    title: z.string().min(1, 'Title is required'),
    employmentType: z.string().min(1, 'Type is required'),
    location: z.string().min(1, 'Location is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().optional(),
    currentlyWorking: z.boolean().optional(),
    description: z.string().optional()
  })).optional(),
  projects: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    technologies: z.string().optional(),
    projectUrl: z.string().optional(),
    repositoryUrl: z.string().optional()
  })).optional(),
  achievements: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    date: z.string().optional(),
    issuingOrganization: z.string().optional()
  })).optional(),
  skills: z.array(z.string()).optional()
});

type ProfileForm = z.infer<typeof profileSchema>;

const Profile = () => {
  const queryClient = useQueryClient();
  const [successMsg, setSuccessMsg] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/student/profile');
      return res.data.data;
    }
  });

  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      headline: '',
      bio: '',
      location: '',
      education: [],
      experience: [],
      projects: [],
      achievements: [],
      skills: []
    }
  });

  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({
    control,
    name: 'education'
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experience'
  });

  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({
    control,
    name: 'projects'
  });

  const { fields: achFields, append: appendAch, remove: removeAch } = useFieldArray({
    control,
    name: 'achievements'
  });

  const [skillInput, setSkillInput] = useState('');
  const skills = watch('skills') || [];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      reset({ ...watch(), skills: newSkills });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    reset({ ...watch(), skills: newSkills });
  };

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        location: profile.location || '',
        education: profile.education?.map((e: any) => ({
          ...e,
          startDate: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : '',
          endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '',
        })) || [],
        experience: profile.experience?.map((e: any) => ({
          ...e,
          startDate: e.startDate ? new Date(e.startDate).toISOString().split('T')[0] : '',
          endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '',
        })) || [],
        projects: profile.projects?.map((p: any) => ({
          ...p,
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies || ''
        })) || [],
        achievements: profile.achievements?.map((a: any) => ({
          ...a,
          date: a.date ? new Date(a.date).toISOString().split('T')[0] : '',
        })) || [],
        skills: profile.skills?.map((s: any) => s.name || s) || []
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put('/student/profile', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  });

  const onSubmit = (data: ProfileForm) => {
    // Process technologies string to array
    const processedData = {
      ...data,
      projects: data.projects?.map(p => ({
        ...p,
        technologies: p.technologies ? p.technologies.split(',').map(t => t.trim()).filter(Boolean) : []
      }))
    };
    updateMutation.mutate(processedData);
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
          <p className="text-text-secondary text-sm">Update your information to stand out to recruiters.</p>
        </div>
        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={updateMutation.isPending}
          className="bg-primary text-white px-6 py-2 rounded-md font-medium flex items-center hover:bg-primary-dark transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {successMsg && (
        <div className="bg-success-light text-success p-4 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Basic Information */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-text-primary border-b border-border pb-3">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">First Name</label>
              <input 
                {...register('firstName')} 
                className="w-full border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.firstName && <p className="text-error text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Last Name</label>
              <input 
                {...register('lastName')} 
                className="w-full border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              {errors.lastName && <p className="text-error text-xs mt-1">{errors.lastName.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">Professional Headline</label>
              <input 
                {...register('headline')} 
                placeholder="e.g. Computer Science Student at University of Tech"
                className="w-full border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">Location</label>
              <input 
                {...register('location')} 
                placeholder="e.g. San Francisco, CA"
                className="w-full border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
              <textarea 
                {...register('bio')} 
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full border border-border rounded-md px-4 py-2 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Education</h2>
            <button 
              type="button" 
              onClick={() => appendEdu({ institution: '', degree: '', fieldOfStudy: '', startDate: '', currentlyStudying: false })}
              className="text-primary text-sm font-medium flex items-center hover:text-primary-dark"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Education
            </button>
          </div>
          
          <div className="space-y-6">
            {eduFields.map((field, index) => {
              const isCurrentlyStudying = watch(`education.${index}.currentlyStudying`);
              return (
                <div key={field.id} className="p-4 border border-border rounded-lg relative bg-surface-secondary">
                  <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-text-muted hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-text-secondary mb-1">Institution</label>
                      <input {...register(`education.${index}.institution`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Degree</label>
                      <input {...register(`education.${index}.degree`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Field of Study</label>
                      <input {...register(`education.${index}.fieldOfStudy`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Start Date</label>
                      <input type="date" {...register(`education.${index}.startDate`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">End Date</label>
                      <input 
                        type="date" 
                        {...register(`education.${index}.endDate`)} 
                        disabled={isCurrentlyStudying}
                        className="w-full border rounded-md px-3 py-1.5 text-sm disabled:opacity-50" 
                      />
                      <label className="flex items-center mt-2 text-xs">
                        <input type="checkbox" {...register(`education.${index}.currentlyStudying`)} className="mr-2" />
                        I currently study here
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
            {eduFields.length === 0 && <p className="text-sm text-text-muted text-center py-4">No education added yet.</p>}
          </div>
        </section>

        {/* Experience Section */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Experience</h2>
            <button 
              type="button" 
              onClick={() => appendExp({ company: '', title: '', employmentType: 'Full-time', location: '', startDate: '', currentlyWorking: false, description: '' })}
              className="text-primary text-sm font-medium flex items-center hover:text-primary-dark"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Experience
            </button>
          </div>
          
          <div className="space-y-6">
            {expFields.map((field, index) => {
              const isCurrentlyWorking = watch(`experience.${index}.currentlyWorking`);
              return (
                <div key={field.id} className="p-4 border border-border rounded-lg relative bg-surface-secondary">
                  <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-text-muted hover:text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Job Title</label>
                      <input {...register(`experience.${index}.title`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Company</label>
                      <input {...register(`experience.${index}.company`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Location</label>
                      <input {...register(`experience.${index}.location`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Employment Type</label>
                      <select {...register(`experience.${index}.employmentType`)} className="w-full border rounded-md px-3 py-1.5 text-sm bg-white">
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">Start Date</label>
                      <input type="date" {...register(`experience.${index}.startDate`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">End Date</label>
                      <input 
                        type="date" 
                        {...register(`experience.${index}.endDate`)} 
                        disabled={isCurrentlyWorking}
                        className="w-full border rounded-md px-3 py-1.5 text-sm disabled:opacity-50" 
                      />
                      <label className="flex items-center mt-2 text-xs">
                        <input type="checkbox" {...register(`experience.${index}.currentlyWorking`)} className="mr-2" />
                        I currently work here
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                      <textarea {...register(`experience.${index}.description`)} rows={3} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                    </div>
                  </div>
                </div>
              );
            })}
            {expFields.length === 0 && <p className="text-sm text-text-muted text-center py-4">No experience added yet.</p>}
          </div>
        </section>

        {/* Projects Section */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Projects</h2>
            <button 
              type="button" 
              onClick={() => appendProj({ title: '', description: '', technologies: '', projectUrl: '', repositoryUrl: '' })}
              className="text-primary text-sm font-medium flex items-center hover:text-primary-dark"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Project
            </button>
          </div>
          
          <div className="space-y-6">
            {projFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative bg-surface-secondary">
                <button type="button" onClick={() => removeProj(index)} className="absolute top-4 right-4 text-text-muted hover:text-error">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Project Title</label>
                    <input {...register(`projects.${index}.title`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Description</label>
                    <textarea {...register(`projects.${index}.description`)} rows={3} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Technologies (comma separated)</label>
                    <input {...register(`projects.${index}.technologies`)} placeholder="React, Node.js, TypeScript" className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Live URL (optional)</label>
                    <input {...register(`projects.${index}.projectUrl`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Repository URL (optional)</label>
                    <input {...register(`projects.${index}.repositoryUrl`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                </div>
              </div>
            ))}
            {projFields.length === 0 && <p className="text-sm text-text-muted text-center py-4">No projects added yet.</p>}
          </div>
        </section>

        {/* Achievements Section */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Achievements</h2>
            <button 
              type="button" 
              onClick={() => appendAch({ title: '', description: '', date: '', issuingOrganization: '' })}
              className="text-primary text-sm font-medium flex items-center hover:text-primary-dark"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Achievement
            </button>
          </div>
          
          <div className="space-y-6">
            {achFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-border rounded-lg relative bg-surface-secondary">
                <button type="button" onClick={() => removeAch(index)} className="absolute top-4 right-4 text-text-muted hover:text-error">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Achievement Title</label>
                    <input {...register(`achievements.${index}.title`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Issuing Organization (optional)</label>
                    <input {...register(`achievements.${index}.issuingOrganization`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-1">Date (optional)</label>
                    <input type="date" {...register(`achievements.${index}.date`)} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-text-secondary mb-1">Description (optional)</label>
                    <textarea {...register(`achievements.${index}.description`)} rows={2} className="w-full border rounded-md px-3 py-1.5 text-sm" />
                  </div>
                </div>
              </div>
            ))}
            {achFields.length === 0 && <p className="text-sm text-text-muted text-center py-4">No achievements added yet.</p>}
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-bold text-text-primary">Skills</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input 
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type a skill and press Enter..."
                className="flex-1 border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button 
                type="button" 
                onClick={addSkill}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-1 bg-primary-light text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-primary hover:text-primary-dark ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-text-muted py-2">No skills added yet.</p>
            )}
          </div>
        </section>

      </form>
    </div>
  );
};

export default Profile;
