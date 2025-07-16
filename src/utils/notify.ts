import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

const types = {
  success: { icon: null, color: '#52c41a' },
  error: { icon: null, color: '#ff4d4f' },
  warning: { icon: null, color: '#faad14' },
  info: { icon: null, color: '#1890ff' },
};

// Notification props interface
interface NotifyProps extends Omit<NotificationArgsProps, 'message' | 'type'> {
  message?: string;
}

// Utility function to show notification
const createNotification =
  (type: keyof typeof types = 'info') =>
  ({
    message,
    description,
    duration = 5, // default popup notification duration
    placement = 'topRight',
    showProgress = true,
    ...rest
  }: NotifyProps): void => {
    const { icon, color } = types[type];
    // max 3 notification only ne shown
    notification.config({ maxCount: 3 });

    const commonStyle = {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderLeft: `4px solid ${color}`,
      paddingRight: '44px',
    };

    notification[type]({
      message,
      description: description ? String(description) : undefined,
      placement,
      duration,
      icon,
      className: `custom-notification custom-notification-${type} cursor-pointer`,
      style: commonStyle as React.CSSProperties,
      showProgress,
      ...rest,
    });
  };

export const notify = {
  success: createNotification('success'),
  error: createNotification('error'),
  warning: createNotification('warning'),
  info: createNotification('info'),
};
