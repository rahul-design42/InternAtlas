import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CheckCircle, XCircle, Search, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';

const AdminOrganizations = () => {
  const queryClient = useQueryClient();
  
  const { data: orgs = [], isLoading } = useQuery({
    queryKey: ['admin-organizations'],
    queryFn: async () => {
      const res = await api.get('/admin/organizations');
      return res.data.data;
    }
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.put(`/admin/organizations/${id}/verify`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organizations'] });
    }
  });

  if (isLoading) return <div className="p-8">Loading organizations...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Organization Moderation</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search organizations..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Name / Website</th>
              <th className="p-4 font-semibold text-slate-700">Industry</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700">Created</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orgs.map((org: any) => (
              <tr key={org._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{org.name}</div>
                  <a href={org.website} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center mt-1">
                    {org.website} <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </td>
                <td className="p-4 text-slate-600">{org.industry || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    org.verificationStatus === 'VERIFIED' ? 'bg-success/10 text-success' : 
                    org.verificationStatus === 'REJECTED' ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
                  }`}>
                    {org.verificationStatus}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{new Date(org.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {org.verificationStatus !== 'VERIFIED' && (
                      <button 
                        onClick={() => {
                          if (confirm(`Approve ${org.name}?`)) {
                            verifyMutation.mutate({ id: org._id, status: 'VERIFIED' })
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-success/10 text-success hover:bg-success/20 rounded transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}
                    {org.verificationStatus !== 'REJECTED' && (
                      <button 
                        onClick={() => {
                          if (confirm(`Reject ${org.name}?`)) {
                            verifyMutation.mutate({ id: org._id, status: 'REJECTED' })
                          }
                        }}
                        className="px-3 py-1.5 text-xs font-medium bg-error/10 text-error hover:bg-error/20 rounded transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrganizations;
