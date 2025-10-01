import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Assignment } from '@/types/schedule';
import { Bell, Calendar, Clock, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItem {
  id: string;
  type: 'deadline' | 'reminder';
  title: string;
  message: string;
  assignment: Assignment;
  createdAt: Date;
  read: boolean;
  urgent: boolean;
}

interface NotificationCenterProps {
  assignments: Assignment[];
}

export function NotificationCenter({ assignments }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Generate notifications based on assignments
  useEffect(() => {
    const now = new Date();
    const generatedNotifications: NotificationItem[] = [];

    assignments.forEach((assignment) => {
      if (assignment.completed) return;

      const dueDate = new Date(assignment.dueDate);
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

      // Two days before
      if (diffDays === 2 && assignment.notifications.twoDaysBefore) {
        generatedNotifications.push({
          id: `${assignment.id}-2days`,
          type: 'reminder',
          title: 'Pengingat: 2 Hari Lagi',
          message: `Tugas "${assignment.title}" akan berakhir dalam 2 hari`,
          assignment,
          createdAt: now,
          read: false,
          urgent: false
        });
      }

      // One day before
      if (diffDays === 1 && assignment.notifications.oneDayBefore) {
        generatedNotifications.push({
          id: `${assignment.id}-1day`,
          type: 'reminder',
          title: 'Pengingat: Besok Deadline',
          message: `Tugas "${assignment.title}" akan berakhir besok`,
          assignment,
          createdAt: now,
          read: false,
          urgent: true
        });
      }

      // Same day
      if (diffDays === 0 && diffHours > 8 && assignment.notifications.sameDay) {
        generatedNotifications.push({
          id: `${assignment.id}-sameday`,
          type: 'deadline',
          title: 'Deadline Hari Ini!',
          message: `Tugas "${assignment.title}" berakhir hari ini`,
          assignment,
          createdAt: now,
          read: false,
          urgent: true
        });
      }

      // 8 hours before
      if (diffHours <= 8 && diffHours > 0 && assignment.notifications.eightHoursBefore) {
        generatedNotifications.push({
          id: `${assignment.id}-8hours`,
          type: 'deadline',
          title: 'Deadline dalam 8 Jam!',
          message: `Tugas "${assignment.title}" berakhir dalam ${diffHours} jam`,
          assignment,
          createdAt: now,
          read: false,
          urgent: true
        });
      }

      // Overdue
      if (diffDays < 0) {
        generatedNotifications.push({
          id: `${assignment.id}-overdue`,
          type: 'deadline',
          title: 'Tugas Terlambat',
          message: `Tugas "${assignment.title}" sudah melewati deadline`,
          assignment,
          createdAt: now,
          read: false,
          urgent: true
        });
      }
    });

    setNotifications(generatedNotifications.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    ));
  }, [assignments]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const urgentNotifications = notifications.filter(n => n.urgent && !n.read);
  const regularNotifications = notifications.filter(n => !n.urgent);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const getPriorityIcon = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium': return <Clock className="h-4 w-4 text-accent" />;
      case 'low': return <CheckCircle2 className="h-4 w-4 text-success" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-foreground">Notifikasi</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="shadow-accent">
              {unreadCount} baru
            </Badge>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Baca Semua
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-8 text-center border-dashed shadow-card">
          <div className="text-muted-foreground space-y-2">
            <Bell className="h-12 w-12 mx-auto opacity-50" />
            <h3 className="font-medium">Tidak ada notifikasi</h3>
            <p className="text-sm">Notifikasi tugas akan muncul di sini</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Urgent Notifications */}
          {urgentNotifications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-destructive flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Penting
              </h3>
              <div className="space-y-2">
                {urgentNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "p-4 border-l-4 border-destructive shadow-card hover:shadow-floating transition-smooth",
                      !notification.read && "bg-destructive/5"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(notification.assignment.priority)}
                          <h4 className="font-medium text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-destructive rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTime(notification.createdAt)}</span>
                          {notification.assignment.subject && (
                            <>
                              <span>•</span>
                              <span>{notification.assignment.subject}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Notifications */}
          {regularNotifications.length > 0 && (
            <div className="space-y-2">
              {urgentNotifications.length > 0 && (
                <h3 className="text-sm font-medium text-muted-foreground">
                  Lainnya
                </h3>
              )}
              <div className="space-y-2">
                {regularNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={cn(
                      "p-4 shadow-card hover:shadow-floating transition-smooth",
                      !notification.read && "bg-accent/5 border-l-4 border-accent"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(notification.assignment.priority)}
                          <h4 className="font-medium text-foreground">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-accent rounded-full" />
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatTime(notification.createdAt)}</span>
                          {notification.assignment.subject && (
                            <>
                              <span>•</span>
                              <span>{notification.assignment.subject}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}