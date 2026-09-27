import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Briefcase, Users, LogOut, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

const RecruiterLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: orgData, isLoading, isError, error } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const res = await api.get('/recruiter/organization');
      return res.data.data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-secondary flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // If recruiter has no organization, they must create one
  if (isError && (error as any).response?.data?.code === 'NO_ORGANIZATION') {
    if (location.pathname !== '/recruiter/onboarding') {
      navigate('/recruiter/onboarding', { replace: true });
      return null;
    }
  }

  // Hide sidebar during onboarding
  if (location.pathname === '/recruiter/onboarding') {
    return (
      <div className="min-h-screen bg-surface-secondary flex flex-col">
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 shadow-sm">
          <Link to="/" className="text-xl font-bold text-primary">InternAtlas</Link>
          <button onClick={logout} className="text-sm font-medium text-error hover:underline">Logout</button>
        </header>
        <main className="flex-1 flex items-center justify-center p-8">
          <Outlet />
        </main>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Opportunities', path: '/recruiter/opportunities', icon: Briefcase },
    { name: 'Candidates', path: '/recruiter/candidates', icon: Users },
    { name: 'Organization', path: '/recruiter/organization', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/" className="text-xl font-bold text-white">InternAtlas <span className="text-primary text-sm ml-1">Recruiter</span></Link>
        </div>
        <div className="px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {orgData?.logo ? (
              <img src={orgData.logo} alt="Org Logo" className="w-10 h-10 rounded-lg object-cover bg-white" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300">
                {orgData?.name?.charAt(0) || 'O'}
              </div>
            )}
            <div>
              <p className="font-bold text-sm truncate w-32">{orgData?.name || 'Loading...'}</p>
              <p className="text-xs text-slate-400">Employer Account</p>
            </div>
          </div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link 
                key={item.name} 
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center justify-end px-8 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
               R
             </div>
           </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RecruiterLayout;
