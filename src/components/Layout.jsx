// components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="lg:pl-80 relative">
      <idebar />
      <main className="p-4 max-w-4xl mx-auto">
        <Outlet /> {/* This renders the matched child routes */}
      </main>
    </div>
  );
};

export default Layout;