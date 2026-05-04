import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ShieldCheck, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Layout = () => {
  const { logout, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-yojana-blue-100 selection:text-yojana-blue-900">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yojana-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-yojana-blue-900">YojanaSetu</span>
          </div>
          {user && (
            <button 
              onClick={logout}
              className="flex items-center space-x-2 text-slate-500 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-32">
        <Outlet />
      </main>
      
      <Navbar />
    </div>
  );
};

export default Layout;
