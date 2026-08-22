import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { 
  Compass, 
  Home, 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Plus, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Styling helpers for main desktop & mobile NavLinks
  const navLinkClass = ({ isActive }) => {
    const baseClass = "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[10px] transition-all duration-150 ease-in-out font-body";
    if (isActive) {
      return `${baseClass} text-[#0d9488] bg-[#f0fdfa]`;
    }
    return `${baseClass} text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]`;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home, end: true },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/create-trip', label: 'Create Trip', icon: Plus },
    { path: '/calendar', label: 'Calendar', icon: CalendarDays },
    { path: '/community', label: 'Community', icon: Users }
  ];

  return (
    <nav className="sticky top-0 z-50 h-16 w-full bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            onClick={closeMenu} 
            className="flex items-center gap-2 text-xl font-bold font-heading text-[#0f172a]"
          >
            <Compass className="w-6 h-6 text-[#0d9488]" />
            <span>GlobeTrotter</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={navLinkClass}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Side: Plan Trip Button & Mock User Profile */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/create-trip"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-medium rounded-[10px] shadow-sm transition-all duration-150 font-body"
          >
            <Plus className="w-4 h-4" />
            <span>Plan a Trip</span>
          </Link>

          {/* Mock User Profile Area */}
          <div className="flex items-center gap-2 border border-[#e2e8f0] rounded-full pl-2 pr-3 py-1.5 bg-[#f8fafc]">
            <div className="w-7 h-7 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs font-heading">
              AM
            </div>
            <span className="text-sm font-medium text-slate-700 font-body">
              Alex Morgan
            </span>
          </div>
        </div>

        {/* Mobile Menu & Hamburger Toggle Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Mock Profile Avatar on Tablet/Mobile */}
          <div className="w-8 h-8 rounded-full bg-[#0d9488] text-white flex items-center justify-center font-bold text-xs font-heading">
            AM
          </div>

          <button
            onClick={toggleMenu}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-[10px] hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Panel */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-[#e2e8f0] shadow-md p-4 space-y-3 font-body">
          <div className="flex flex-col gap-1.5">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={closeMenu}
                className={navLinkClass}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-2 border-t border-[#e2e8f0]">
            <Link
              to="/create-trip"
              onClick={closeMenu}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-medium rounded-[10px] shadow-sm transition-all duration-150 font-body"
            >
              <Plus className="w-4 h-4" />
              <span>Plan a Trip</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
