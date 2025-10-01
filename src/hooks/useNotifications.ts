import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Assignment } from '@/types/schedule';

export const useNotifications = (assignments: Assignment[]) => {
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const result = await LocalNotifications.requestPermissions();
        if (result.display === 'granted') {
          console.log('Notification permissions granted');
        }
      } catch (error) {
        console.log('Error requesting notification permissions:', error);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const scheduleNotifications = async () => {
      try {
        // Clear existing notifications
        await LocalNotifications.cancel({ notifications: [] });

        const notifications: any[] = [];
        let notificationId = 1;

        assignments.forEach((assignment) => {
          if (!assignment.completed && assignment.notifications) {
            const dueDate = new Date(assignment.dueDate);
            const now = new Date();

            // Two days before
            if (assignment.notifications.twoDaysBefore) {
              const twoDaysBefore = new Date(dueDate);
              twoDaysBefore.setDate(twoDaysBefore.getDate() - 2);
              if (twoDaysBefore > now) {
                notifications.push({
                  title: 'Pengingat Tugas',
                  body: `Tugas "${assignment.title}" akan due dalam 2 hari`,
                  id: notificationId++,
                  schedule: { at: twoDaysBefore },
                });
              }
            }

            // One day before
            if (assignment.notifications.oneDayBefore) {
              const oneDayBefore = new Date(dueDate);
              oneDayBefore.setDate(oneDayBefore.getDate() - 1);
              if (oneDayBefore > now) {
                notifications.push({
                  title: 'Pengingat Tugas',
                  body: `Tugas "${assignment.title}" akan due besok`,
                  id: notificationId++,
                  schedule: { at: oneDayBefore },
                });
              }
            }

            // Same day
            if (assignment.notifications.sameDay) {
              const sameDay = new Date(dueDate);
              sameDay.setHours(9, 0, 0, 0); // 9 AM on due date
              if (sameDay > now) {
                notifications.push({
                  title: 'Pengingat Tugas',
                  body: `Hari ini adalah deadline tugas "${assignment.title}"`,
                  id: notificationId++,
                  schedule: { at: sameDay },
                });
              }
            }

            // Eight hours before
            if (assignment.notifications.eightHoursBefore) {
              const eightHoursBefore = new Date(dueDate);
              eightHoursBefore.setHours(eightHoursBefore.getHours() - 8);
              if (eightHoursBefore > now) {
                notifications.push({
                  title: 'Pengingat Tugas Mendesak',
                  body: `Tugas "${assignment.title}" akan due dalam 8 jam`,
                  id: notificationId++,
                  schedule: { at: eightHoursBefore },
                });
              }
            }
          }
        });

        if (notifications.length > 0) {
          await LocalNotifications.schedule({
            notifications,
          });
          console.log(`Scheduled ${notifications.length} notifications`);
        }
      } catch (error) {
        console.log('Error scheduling notifications:', error);
      }
    };

    scheduleNotifications();
  }, [assignments]);
};