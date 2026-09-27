import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Ban, CheckCircle, Shield } from 'lucide-react';
import api from '../../lib/axios';

const AdminOpportunities = () => {
  const queryClient = useQueryClient();
  
  const { data: opps = [], isLoading } = useQuery({
    queryKey: ['admin-opportunities'],
    queryFn: async () => {
      const res = await api.get('/admin/opportunities');
      return res.data.data;
    }
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: any }) => {
      await api.put(`/admin/opportunities/${id}/moderate`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-opportunities'] });
    }
  });

  if (isLoading) return <div className="p-8">Loading opportunities...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Opportunity Moderation</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Listing Title</th>
              <th className="p-4 font-semibold text-slate-700">Organization</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700">Flags</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {opps.map((opp: any) => (
              <tr key={opp._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{opp.title}</div>
                  <div className="text-xs text-slate-500 mt-1 capitalize">{opp.type.toLowerCase().replace('_', ' ')} • {opp.location}</div>
                </td>
                <td className="p-4 font-medium text-slate-700">{opp.organizationId?.name || 'Unknown'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    opp.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 
                    opp.status === 'SUSPENDED' ? 'bg-error/10 text-error' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {opp.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {opp.isVerified && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Verified</span>}
                    {opp.isFeatured && <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-xs font-bold">Featured</span>}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    {opp.status !== 'SUSPENDED' && (
                      <button 
                        onClick={() => {
                          if (confirm('Suspend this opportunity? It will be removed from public view.')) {
                            moderateMutation.mutate({ id: opp._id, data: { status: 'SUSPENDED' } })
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-error hover:bg-error/10 rounded transition-colors"
                        title="Suspend Listing"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                    {opp.status === 'SUSPENDED' && (
                      <button 
                        onClick={() => moderateMutation.mutate({ id: opp._id, data: { status: 'PUBLISHED' } })}
                        className="p-1.5 text-slate-400 hover:text-success hover:bg-success/10 rounded transition-colors"
                        title="Restore Listing"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button 
                      onClick={() => moderateMutation.mutate({ id: opp._id, data: { isVerified: !opp.isVerified } })}
                      className={`p-1.5 rounded transition-colors ${opp.isVerified ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:bg-slate-100'}`}
                      title={opp.isVerified ? 'Remove Verification' : 'Mark as Verified'}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
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

export default AdminOpportunities;
