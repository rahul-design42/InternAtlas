import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Building2, AlertCircle } from 'lucide-react';
import api from '../../lib/axios';

const orgSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  industry: z.string().min(2, 'Industry is required'),
  companySize: z.string().min(1, 'Company size is required'),
});

type OrgForm = z.infer<typeof orgSchema>;

const CreateOrganization = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState: { errors } } = useForm<OrgForm>({
    resolver: zodResolver(orgSchema)
  });

  const mutation = useMutation({
    mutationFn: async (data: OrgForm) => {
      const res = await api.post('/recruiter/organization', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      navigate('/recruiter/dashboard');
    }
  });

  return (
    <div className="bg-white p-8 rounded-xl border border-border shadow-md max-w-lg w-full">
      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 mx-auto">
        <Building2 className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold text-center text-text-primary mb-2">Welcome, Recruiter!</h1>
      <p className="text-center text-text-secondary mb-8">Before you can post opportunities, tell us about your organization.</p>
      
      {mutation.isError && (
        <div className="mb-6 p-4 bg-error-light text-error rounded-md flex items-start text-sm">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p>{(mutation.error as any).response?.data?.message || 'Failed to create organization'}</p>
        </div>
      )}

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Organization Name *</label>
          <input 
            type="text" 
            {...register('name')}
            className={`w-full p-3 bg-surface-secondary border ${errors.name ? 'border-error' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
            placeholder="e.g. Acme Corp"
          />
          {errors.name && <p className="text-error text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">Website</label>
          <input 
            type="text" 
            {...register('website')}
            className={`w-full p-3 bg-surface-secondary border ${errors.website ? 'border-error' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
            placeholder="https://example.com"
          />
          {errors.website && <p className="text-error text-xs mt-1">{errors.website.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Industry *</label>
            <input 
              type="text" 
              {...register('industry')}
              className={`w-full p-3 bg-surface-secondary border ${errors.industry ? 'border-error' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
              placeholder="e.g. Technology"
            />
            {errors.industry && <p className="text-error text-xs mt-1">{errors.industry.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Company Size *</label>
            <select 
              {...register('companySize')}
              className={`w-full p-3 bg-surface-secondary border ${errors.companySize ? 'border-error' : 'border-border'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors`}
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            {errors.companySize && <p className="text-error text-xs mt-1">{errors.companySize.message}</p>}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full bg-primary text-white p-3 rounded-md font-bold hover:bg-primary-dark transition-colors disabled:opacity-70 mt-6"
        >
          {mutation.isPending ? 'Creating...' : 'Create Organization'}
        </button>
      </form>
    </div>
  );
};

export default CreateOrganization;
