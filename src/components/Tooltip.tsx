import React from 'react';
import { Tooltip } from 'antd';

interface TextTooltipProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

const FsTextTooltip: React.FC<TextTooltipProps> = ({ text, className, children }) => {
  if (children) {
    return (
      <Tooltip
        title={text}
        placement="top"
        color="gray"
        className={className || 'cursor-pointer'}
        overlayStyle={{
          textTransform: 'capitalize',
          textDecoration: 'none',
        }}
      >
        {children}
      </Tooltip>
    );
  }
  return text?.length > 14 ? (
    <Tooltip
      title={text}
      placement="top"
      color="gray"
      className="cursor-pointer"
      overlayStyle={{
        textTransform: 'capitalize',
        textDecoration: 'none',
      }}
    >
      <span className="truncate-text">{`${text.slice(0, 14)}...`}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};

export default FsTextTooltip;
