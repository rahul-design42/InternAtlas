import { useQuery } from '@tanstack/react-query';
import { Briefcase, Users, FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const RecruiterDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['recruiter-dashboard'],
    queryFn: async () => {
      const res = await api.get('/recruiter/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Recruiter Dashboard</h1>
          <p className="text-text-secondary">Overview of your organization's recruitment activities.</p>
        </div>
        <Link to="/recruiter/opportunities/create" className="bg-primary text-white px-6 py-2 rounded-md font-medium flex items-center hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Post Opportunity
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Active Opportunities</p>
              <h3 className="text-3xl font-bold text-text-primary">{data?.activeOpportunities || 0}</h3>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-lg"><Briefcase className="w-5 h-5"/></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Total Applications</p>
              <h3 className="text-3xl font-bold text-text-primary">{data?.totalApplications || 0}</h3>
            </div>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Users className="w-5 h-5"/></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">New Applications</p>
              <h3 className="text-3xl font-bold text-success">{data?.newApplications || 0}</h3>
            </div>
            <div className="p-2 bg-success/10 text-success rounded-lg"><FileText className="w-5 h-5"/></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-border p-8 text-center shadow-sm">
        <h3 className="text-lg font-bold text-text-primary mb-2">Welcome to the Recruiter Portal</h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">From here you can create new job postings, review candidates in your pipeline, and manage your organization profile.</p>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
