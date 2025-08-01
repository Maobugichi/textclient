import { useNotifications } from './notificationProvider';

export const NotificationsInitializer = () => {
  useNotifications();
  return null; 
};
