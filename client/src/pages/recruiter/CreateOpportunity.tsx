import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

const oppSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  type: z.enum(['INTERNSHIP', 'JOB', 'HACKATHON', 'COMPETITION']),
  workMode: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
  location: z.object({ city: z.string().optional() }),
  description: z.string().min(20, 'Description is too short'),
  requirements: z.string().min(10, 'Requirements are too short'),
  stipend: z.object({ amount: z.string().optional(), currency: z.string().optional(), type: z.string().optional() }),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type OppForm = z.infer<typeof oppSchema>;

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<OppForm>({
    resolver: zodResolver(oppSchema),
    defaultValues: {
      type: 'INTERNSHIP',
      workMode: 'REMOTE',
      status: 'PUBLISHED'
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: OppForm) => {
      // API expects strings for stipend type/currency, but allows objects. Will submit as is.
      const res = await api.post('/recruiter/opportunities', {
        ...data,
        requirements: data.requirements.split('\n').filter(Boolean),
        responsibilities: []
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recruiter-opportunities'] });
      navigate('/recruiter/opportunities');
    }
  });

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-text-primary mb-2">Create Opportunity</h1>
      <p className="text-text-secondary mb-8">Post a new job, internship, or event for candidates.</p>
      
      {mutation.isError && (
        <div className="mb-6 p-4 bg-error-light text-error rounded-md flex items-start text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{(mutation.error as any).response?.data?.message || 'Failed to create opportunity'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6 bg-white p-8 rounded-xl border border-border shadow-sm">
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Title *</label>
          <input type="text" {...register('title')} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none" />
          {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Type *</label>
            <select {...register('type')} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary outline-none">
              <option value="INTERNSHIP">Internship</option>
              <option value="JOB">Job</option>
              <option value="HACKATHON">Hackathon</option>
              <option value="COMPETITION">Competition</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Work Mode *</label>
            <select {...register('workMode')} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary outline-none">
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Location (City)</label>
          <input type="text" {...register('location.city')} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Description *</label>
          <textarea {...register('description')} rows={4} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary outline-none"></textarea>
          {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Requirements (one per line) *</label>
          <textarea {...register('requirements')} rows={4} className="w-full p-3 bg-surface-secondary border border-border rounded-md focus:border-primary outline-none"></textarea>
          {errors.requirements && <p className="text-error text-xs mt-1">{errors.requirements.message}</p>}
        </div>

        <div className="flex gap-4 pt-4 border-t border-border">
          <button type="submit" onClick={() => register('status').onChange({ target: { value: 'DRAFT', name: 'status' }})} disabled={mutation.isPending} className="px-6 py-2 border border-border rounded-md font-medium text-text-primary hover:bg-surface">
            Save Draft
          </button>
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-primary-dark">
            {mutation.isPending ? 'Publishing...' : 'Publish Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOpportunity;
