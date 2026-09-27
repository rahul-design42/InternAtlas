import { FileText, Bookmark, CheckCircle, Send, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/student/dashboard');
      return res.data.data;
    }
  });

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  const applicationsCount = data?.applicationsCount || 0;
  const savedCount = data?.savedCount || 0;
  
  const stats = data?.stats || [];
  const shortlistedCount = stats.find((s: any) => s._id === 'SHORTLISTED')?.count || 0;
  const underReviewCount = stats.find((s: any) => s._id === 'REVIEWING')?.count || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome back!</h1>
      <p className="text-text-secondary mb-8">Here is a summary of your career progress.</p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link to="/student/applications" className="bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary transition-colors block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Applications</p>
              <h3 className="text-3xl font-bold text-text-primary">{applicationsCount}</h3>
            </div>
            <div className="p-2 bg-primary-light text-primary rounded-lg"><FileText className="w-5 h-5"/></div>
          </div>
        </Link>

        <Link to="/student/saved" className="bg-white p-6 rounded-xl border border-border shadow-sm hover:border-primary transition-colors block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Saved</p>
              <h3 className="text-3xl font-bold text-text-primary">{savedCount}</h3>
            </div>
            <div className="p-2 bg-secondary/10 text-secondary rounded-lg"><Bookmark className="w-5 h-5"/></div>
          </div>
        </Link>

        <Link to="/student/applications" className="bg-white p-6 rounded-xl border border-border shadow-sm hover:border-success transition-colors block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Shortlisted</p>
              <h3 className="text-3xl font-bold text-success">{shortlistedCount}</h3>
            </div>
            <div className="p-2 bg-success-light text-success rounded-lg"><CheckCircle className="w-5 h-5"/></div>
          </div>
        </Link>
        
        <Link to="/student/applications" className="bg-white p-6 rounded-xl border border-border shadow-sm hover:border-warning transition-colors block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-text-muted text-sm font-medium mb-1">Under Review</p>
              <h3 className="text-3xl font-bold text-warning">{underReviewCount}</h3>
            </div>
            <div className="p-2 bg-warning-light text-warning rounded-lg"><Send className="w-5 h-5"/></div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Build Your Profile</h3>
            <p className="text-text-secondary text-sm mb-4">Add your education, experience, projects, and skills to stand out to recruiters.</p>
          </div>
          <Link to="/student/profile" className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors text-sm">
            Edit Profile <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg mb-2">Manage Resumes</h3>
            <p className="text-text-secondary text-sm mb-4">Upload and organize your resumes to easily apply to opportunities.</p>
          </div>
          <Link to="/student/resumes" className="inline-flex items-center text-primary font-bold hover:text-primary-dark transition-colors text-sm">
            View Resumes <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
