import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Footer } from './Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-on-surface">
      <Header />
      <div className="flex-1 w-full">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default PublicLayout;
