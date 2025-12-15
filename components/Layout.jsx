import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function Layout() {
  return (
    <div className="min-h-screen bg-primary-dark text-slate-200 selection:bg-accent-cyan selection:text-primary-dark">
      <Navbar />
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-primary-light border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 lg:px-8 py-8">
          <div className="text-center text-slate-400">
            <p>&copy; 2025 Joohoon Kim. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
