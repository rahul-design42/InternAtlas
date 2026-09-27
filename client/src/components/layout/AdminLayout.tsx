import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building2, Briefcase, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navGroups = [
    {
      title: 'Platform',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', path: '/admin/users', icon: Users },
        { name: 'Organizations', path: '/admin/organizations', icon: Building2 },
      ]
    },
    {
      title: 'Moderation',
      items: [
        { name: 'Opportunities', path: '/admin/opportunities', icon: Briefcase }
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Content Logs', path: '/admin/logs', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Dark sidebar for Admin */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <Link to="/" className="text-xl font-bold text-white">InternAtlas <span className="text-error text-sm ml-1">Admin</span></Link>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto">
          {navGroups.map((group, idx) => (
            <div key={idx} className="mb-6">
              <p className="px-6 text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">{group.title}</p>
              <div className="space-y-1 px-3">
                {group.items.map(item => {
                  const active = location.pathname.startsWith(item.path);
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name} 
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-primary' : 'text-slate-400'}`} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2 w-full text-left text-sm font-medium hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h2 className="font-semibold text-slate-800">Admin Operations</h2>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center font-bold text-sm border border-error/20">
               A
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

export default AdminLayout;
