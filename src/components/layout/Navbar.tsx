import { NavLink } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { LEAGUES } from '../../config/leagues';

const navItems = [
  { path: '/', label: 'Dashboard' },
  ...Object.values(LEAGUES).map((l) => ({
    path: l.path,
    label: l.name,
  })),
];

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-border-subtle/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <Activity className="text-accent" size={22} />
            <span className="font-display font-bold text-lg hidden sm:inline">
              Sports HQ
            </span>
          </NavLink>

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-accent/15 text-accent'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-overlay/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
