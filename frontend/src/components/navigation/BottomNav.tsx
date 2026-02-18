import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Activity, History, TrendingUp } from 'lucide-react';
import { useAppState } from '../../state/useAppState';

export default function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const { isInitialized } = useAppState();
  
  if (!isInitialized) return null;

  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'HOME' },
    { path: '/reality-check', icon: Activity, label: 'REALITY' },
    { path: '/history', icon: History, label: 'HISTORY' },
    { path: '/stats', icon: TrendingUp, label: 'STATS' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-primary/20 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = currentPath === path || (path === '/dashboard' && currentPath === '/');
          
          return (
            <button
              key={path}
              onClick={() => navigate({ to: path })}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 ${isActive ? 'animate-pulse-glow' : ''}`} />
              <span className="text-xs font-rajdhani font-semibold tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
