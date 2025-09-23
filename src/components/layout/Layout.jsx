import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileSidebar from './MobileSidebar';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <main>
        {children}
      </main>
      <Footer />
      <MobileSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
}

export default Layout;