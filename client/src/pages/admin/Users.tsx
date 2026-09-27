import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ban, CheckCircle, Search } from 'lucide-react';
import api from '../../lib/axios';

const AdminUsers = () => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.put(`/admin/users/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    }
  });

  if (isLoading) return <div className="p-8">Loading users...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Email</th>
              <th className="p-4 font-semibold text-slate-700">Role</th>
              <th className="p-4 font-semibold text-slate-700">Status</th>
              <th className="p-4 font-semibold text-slate-700">Joined</th>
              <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user: any) => (
              <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-900">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    user.role === 'ADMIN' ? 'bg-error/10 text-error' :
                    user.role === 'RECRUITER' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    user.status === 'ACTIVE' ? 'bg-success/10 text-success' : 
                    user.status === 'SUSPENDED' ? 'bg-warning/10 text-warning' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {user.role !== 'ADMIN' && (
                    <div className="flex justify-end gap-2">
                      {user.status === 'ACTIVE' ? (
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to suspend this user?')) {
                              updateStatusMutation.mutate({ id: user._id, status: 'SUSPENDED' })
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-error hover:bg-error/10 rounded transition-colors"
                          title="Suspend"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => updateStatusMutation.mutate({ id: user._id, status: 'ACTIVE' })}
                          className="p-1.5 text-slate-400 hover:text-success hover:bg-success/10 rounded transition-colors"
                          title="Activate"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
