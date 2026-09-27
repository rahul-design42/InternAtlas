import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-on-surface">
      <Navbar />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
