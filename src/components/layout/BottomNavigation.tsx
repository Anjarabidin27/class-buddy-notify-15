import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, Bell, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: 'today' | 'schedule' | 'assignments' | 'notifications';
  onTabChange: (tab: 'today' | 'schedule' | 'assignments' | 'notifications') => void;
  assignmentCount?: number;
}

export function BottomNavigation({ activeTab, onTabChange, assignmentCount = 0 }: BottomNavigationProps) {
  const tabs = [
    {
      id: 'today' as const,
      label: 'Hari Ini',
      icon: Clock,
      badge: null
    },
    {
      id: 'schedule' as const,
      label: 'Jadwal',
      icon: Calendar,
      badge: null
    },
    {
      id: 'assignments' as const,
      label: 'Tugas',
      icon: CheckSquare,
      badge: assignmentCount > 0 ? assignmentCount : null
    },
    {
      id: 'notifications' as const,
      label: 'Notifikasi',
      icon: Bell,
      badge: null
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-floating">
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex-1 flex-col h-14 gap-1 relative transition-smooth",
                isActive && "shadow-card"
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  "h-5 w-5",
                  isActive ? "text-primary-foreground" : "text-muted-foreground"
                )} />
                {tab.badge && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-accent">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary-foreground" : "text-muted-foreground"
              )}>
                {tab.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}