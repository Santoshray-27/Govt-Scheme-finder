import { Link, useLocation } from 'react-router-dom';
import { Home, BookmarkCheck, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Schemes', path: '/schemes', icon: BookmarkCheck },
    { name: 'Profile', path: '/profile-builder', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/dashboard' || location.pathname === '/recommendations')) return true;
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe sm:bottom-6 sm:left-1/2 sm:-translate-x-1/2 sm:w-max sm:rounded-full sm:border sm:shadow-soft z-50 transition-all">
      <div className="flex items-center justify-around px-2 sm:px-6 h-16 sm:h-14">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path}
            className={`flex flex-col sm:flex-row items-center justify-center w-full sm:w-auto sm:px-4 space-y-1 sm:space-y-0 sm:space-x-2 relative group ${isActive(item.path) ? 'text-yojana-blue-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <div className={`relative z-10 p-1 sm:p-2 rounded-full transition-colors ${isActive(item.path) ? 'text-yojana-blue-900' : 'group-hover:bg-slate-50'}`}>
              <item.icon size={20} className={isActive(item.path) ? 'stroke-[2.5px]' : ''} />
            </div>
            <span className={`text-[10px] sm:text-sm font-semibold ${isActive(item.path) ? 'text-yojana-blue-900' : ''}`}>
              {item.name}
            </span>
            {isActive(item.path) && (
              <motion.div 
                layoutId="nav-indicator"
                className="absolute inset-0 sm:bg-yojana-blue-50 sm:rounded-full -z-0"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {/* Mobile active indicator dot */}
            {isActive(item.path) && (
              <div className="sm:hidden absolute -top-0 w-12 h-1 bg-yojana-orange-500 rounded-b-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
