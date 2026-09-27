import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Users } from 'lucide-react';
import api from '../../lib/axios';

const Opportunities = () => {
  const { data: opportunities = [], isLoading } = useQuery({
    queryKey: ['recruiter-opportunities'],
    queryFn: async () => {
      const res = await api.get('/recruiter/opportunities');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Opportunities</h1>
          <p className="text-text-secondary">Manage your job and internship postings.</p>
        </div>
        <Link to="/recruiter/opportunities/create" className="bg-primary text-white px-6 py-2 rounded-md font-medium flex items-center hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Post Opportunity
        </Link>
      </div>

      {opportunities.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-border text-center">
          <h3 className="text-lg font-bold mb-2">No Opportunities Posted</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">You haven't created any opportunities yet. Create your first posting to start receiving applications.</p>
          <Link to="/recruiter/opportunities/create" className="bg-primary text-white px-6 py-2 rounded-md font-medium inline-block">
            Create Posting
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-secondary text-text-secondary text-sm">
                <th className="p-4 font-bold border-b border-border">Title</th>
                <th className="p-4 font-bold border-b border-border">Type</th>
                <th className="p-4 font-bold border-b border-border">Status</th>
                <th className="p-4 font-bold border-b border-border">Date Posted</th>
                <th className="p-4 font-bold border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp: any) => (
                <tr key={opp._id} className="border-b border-border hover:bg-surface transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-text-primary">{opp.title}</p>
                    <p className="text-xs text-text-muted">{opp.location?.city || 'Remote'}</p>
                  </td>
                  <td className="p-4 text-sm">{opp.type}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      opp.status === 'PUBLISHED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                    }`}>
                      {opp.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-text-secondary">
                    {new Date(opp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-3">
                      <Link to={`/recruiter/opportunities/${opp._id}/applications`} className="text-secondary hover:text-secondary-dark flex items-center text-sm font-medium">
                        <Users className="w-4 h-4 mr-1" /> View Apps
                      </Link>
                      <button className="text-text-muted hover:text-primary transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
