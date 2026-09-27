import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, MapPin, Briefcase, BookmarkMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';

const SavedOpportunities = () => {
  const queryClient = useQueryClient();

  const { data: saved = [], isLoading, isError } = useQuery({
    queryKey: ['saved'],
    queryFn: async () => {
      const res = await api.get('/student/saved');
      return res.data.data;
    }
  });

  const toggleSaveMutation = useMutation({
    mutationFn: async (opportunityId: string) => {
      const res = await api.post('/student/saved/toggle', { opportunityId });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved'] });
    }
  });

  if (isLoading) return <div className="p-8">Loading saved opportunities...</div>;
  if (isError) return <div className="p-8 text-error">Failed to load saved opportunities.</div>;

  return (
    <div className="max-w-4xl space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Saved Opportunities</h1>
        <p className="text-text-secondary text-sm">Keep track of opportunities you're interested in.</p>
      </div>

      {saved.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-border shadow-sm text-center flex flex-col items-center">
          <Bookmark className="w-12 h-12 text-text-muted mb-4" />
          <h3 className="text-lg font-bold text-text-primary mb-2">No Saved Opportunities</h3>
          <p className="text-text-secondary text-sm max-w-md mb-6">You haven't saved any opportunities yet. Browse jobs and internships to save them for later.</p>
          <Link to="/jobs" className="bg-primary text-white px-6 py-2 rounded-md font-medium">Browse Jobs</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {saved.map((item: any) => {
            const opp = item.opportunityId;
            if (!opp) return null; // In case the opportunity was deleted
            
            return (
              <div key={item._id} className="bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex gap-4">
                  {opp.organizationId?.logoUrl ? (
                    <img src={opp.organizationId.logoUrl} alt="Logo" className="w-12 h-12 rounded-md object-cover border border-border" />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-surface-secondary border border-border flex items-center justify-center font-bold text-text-muted">
                      {opp.organizationId?.name?.charAt(0) || 'O'}
                    </div>
                  )}
                  <div>
                    <Link to={`/opportunities/${opp.slug}`} className="font-bold text-lg text-text-primary hover:text-primary transition-colors">
                      {opp.title}
                    </Link>
                    <p className="text-sm font-medium text-text-secondary mb-2">{opp.organizationId?.name || 'Unknown Organization'}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-text-muted">
                      <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-1"/> {opp.type}</span>
                      <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1"/> {opp.location?.city || 'Remote'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex w-full md:w-auto gap-3 mt-4 md:mt-0 border-t border-border md:border-t-0 pt-4 md:pt-0">
                  <button 
                    onClick={() => toggleSaveMutation.mutate(opp._id)}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 border border-border rounded-md text-text-secondary hover:text-error hover:border-error hover:bg-error-light transition-colors"
                    title="Unsave"
                  >
                    <BookmarkMinus className="w-4 h-4" />
                  </button>
                  <Link 
                    to={`/opportunities/${opp.slug}`}
                    className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary-dark transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedOpportunities;
