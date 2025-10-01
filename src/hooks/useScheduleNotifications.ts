import { useEffect } from 'react';
import { ScheduleItem } from '@/types/schedule';
import { usePWANotifications } from './usePWANotifications';

export const useScheduleNotifications = (scheduleItems: ScheduleItem[]) => {
  const { sendNotification } = usePWANotifications();

  useEffect(() => {
    const checkUpcomingSchedules = () => {
      const now = new Date();
      const currentDay = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][now.getDay()];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      // Get today's schedule
      const todaySchedule = scheduleItems.filter(item => item.day === currentDay);

      todaySchedule.forEach(schedule => {
        // Calculate 5 minutes before start time
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        const startTime = new Date(now);
        startTime.setHours(startHour, startMinute, 0, 0);
        
        const notificationTime = new Date(startTime.getTime() - 5 * 60 * 1000); // 5 minutes before
        const notificationTimeStr = `${notificationTime.getHours().toString().padStart(2, '0')}:${notificationTime.getMinutes().toString().padStart(2, '0')}`;

        // Check if current time matches notification time
        if (currentTime === notificationTimeStr) {
          const notificationKey = `schedule-${schedule.id}-${now.toDateString()}`;
          
          // Check if we already sent notification today
          if (!localStorage.getItem(notificationKey)) {
            sendNotification(
              `Jadwal Kuliah - ${schedule.title}`,
              `Dalam 5 menit di ruangan ${schedule.room}`,
              0
            );
            
            // Mark as sent for today
            localStorage.setItem(notificationKey, 'sent');
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkUpcomingSchedules, 60000);
    
    // Also check immediately
    checkUpcomingSchedules();

    return () => clearInterval(interval);
  }, [scheduleItems, sendNotification]);
};