import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UserCircle, Bookmark, FileText, Bell, LogOut } from 'lucide-react';

const CandidateLayout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/student/profile', icon: UserCircle },
    { name: 'Resumes', path: '/student/resumes', icon: FileText },
    { name: 'Applications', path: '/student/applications', icon: FileText },
    { name: 'Saved', path: '/student/saved', icon: Bookmark },
    { name: 'Notifications', path: '/student/notifications', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="text-xl font-bold text-primary">InternAtlas</Link>
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
                  active ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-text-muted'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm font-medium text-error hover:bg-error-light rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-end px-8 shadow-sm">
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
               C
             </div>
           </div>
        </header>

        {/* Dynamic Outlet */}
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;
