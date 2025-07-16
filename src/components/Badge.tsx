import { Badge } from 'antd';

export type BadgePropsType = {
  text?: string;
  textColor?: string;
  backgroundColor?: string;
  className?: string;
  status: statusTypes;
};

export enum statusTypes {
  warning = 'warning',
  success = 'success',
  error = 'error',
}

const badgeStyle = {
  default: {
    textColor: 'rgba(152,152,152,1)',
    backgroundColor: 'rgba(241,241,241,0.1)',
  },
  success: {
    textColor: 'rgba(41, 185, 95, 1)',
    backgroundColor: 'rgba(41, 185, 95, 0.1)',
  },
  warning: {
    textColor: 'rgba(250, 176, 32, 1)',
    backgroundColor: 'rgba(250, 176, 32, 0.1)',
  },
  error: {
    textColor: 'rgba(210, 15, 15, 1)',
    backgroundColor: 'rgba(210, 15, 15, 0.1)',
  },
};

const FsBadge = ({ text, status, className }: BadgePropsType) => {
  return (
    <div>
      <Badge
        className={`px-3 py-1 rounded-[30px] ${className}`}
        status={status}
        text={text}
        style={{
          color: badgeStyle[status].textColor,
          background: badgeStyle[status].backgroundColor,
        }}
      />
    </div>
  );
};

export default FsBadge;
