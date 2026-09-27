import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, ChevronRight, FileText } from 'lucide-react';
import api from '../../lib/axios';

const Applications = () => {
  const { data: applications = [], isLoading, isError } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get('/student/applications');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading applications...</div>;
  if (isError) return <div className="p-8 text-error">Failed to load applications.</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-blue-100 text-blue-700';
      case 'REVIEWING': return 'bg-warning-light text-warning';
      case 'SHORTLISTED': return 'bg-success-light text-success';
      case 'REJECTED': return 'bg-error-light text-error';
      case 'ACCEPTED': return 'bg-success text-white';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">My Applications</h1>
        <p className="text-text-secondary text-sm">Track the status of opportunities you've applied to.</p>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-border shadow-sm text-center flex flex-col items-center">
          <FileText className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No Applications Yet</h3>
          <p className="text-text-secondary text-sm max-w-md mb-6">You haven't applied to any opportunities yet. Browse and apply to kickstart your career.</p>
          <Link to="/internships" className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors">
            Browse Internships
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border">
          {applications.map((app: any) => {
            const opp = app.opportunityId;
            if (!opp) return null;
            return (
              <Link 
                to={`/student/applications/${app._id}`}
                key={app._id} 
                className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-surface-secondary transition-colors block"
              >
                <div className="flex gap-4 w-full md:w-auto">
                  {opp.organizationId?.logoUrl ? (
                    <img src={opp.organizationId.logoUrl} alt="Logo" className="w-12 h-12 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-surface-secondary border border-border flex items-center justify-center font-bold text-text-muted flex-shrink-0">
                      {opp.organizationId?.name?.charAt(0) || 'O'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-text-primary mb-1 line-clamp-1">{opp.title}</h3>
                    <p className="text-sm font-medium text-text-secondary mb-2">{opp.organizationId?.name || 'Unknown Organization'}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                      <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1"/> {opp.type}</span>
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1"/> {opp.location?.city || 'Remote'}</span>
                      <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1"/> Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between w-full md:w-auto mt-4 md:mt-0 border-t border-border md:border-t-0 pt-4 md:pt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <ChevronRight className="w-5 h-5 text-text-muted ml-4 hidden md:block" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;
