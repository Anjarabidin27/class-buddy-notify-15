import { useEffect } from 'react';

export const usePWANotifications = () => {
  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            console.log('PWA Notification permission granted');
          }
        } catch (error) {
          console.log('Error requesting PWA notification permission:', error);
        }
      }
    };

    requestPermission();
  }, []);

  const sendNotification = (title: string, body: string, delay: number = 0) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(title, {
          body,
          icon: '/logo-udinus-192.png',
          badge: '/logo-udinus-192.png',
          tag: 'jadwal-reminder',
          requireInteraction: true
        });
      }, delay);
    }
  };

  return { sendNotification };
};