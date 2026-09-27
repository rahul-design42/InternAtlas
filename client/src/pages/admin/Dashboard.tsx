import { useQuery } from '@tanstack/react-query';
import { Users, Building2, Briefcase, FileText } from 'lucide-react';
import api from '../../lib/axios';

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  const stats = [
    { name: 'Total Users', value: data?.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Pending Orgs', value: data?.pendingOrganizations, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-100' },
    { name: 'Opportunities', value: data?.totalOpportunities, icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { name: 'Applications', value: data?.totalApplications, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value || 0}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Admin Operations Center</h3>
        <p className="text-slate-500 max-w-lg mx-auto">Use the sidebar to navigate to specific operational areas. Please exercise caution with moderation actions.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
