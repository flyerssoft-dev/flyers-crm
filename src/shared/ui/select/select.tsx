import React from 'react';
import { Select as AntSelect } from 'antd';
import type { SelectProps } from 'antd';

export interface FsSelectProps extends SelectProps {
  /**
   * Additional test ID for testing
   */
  testId?: string;
  /**
   * Label for the select
   */
  label?: string;
  /**
   * Helper text to display below the select
   */
  helperText?: string;
  /**
   * Options for the select
   */
  // options?: Array<{
  //   label: React.ReactNode;
  //   value: T;
  //   disabled?: boolean;
  //   key?: string | number;
  // }>;
}

export const FsSelect: React.FC<FsSelectProps> = ({
  className = '',
  testId,
  label,
  helperText,
  options = [],
  ...props
}) => {
  return (
    <div className="fs-select-wrapper">
      {label && <label className="fs-select-label">{label}</label>}
      <AntSelect
        className={`fs-select ${className}`}
        data-testid={testId}
        options={options}
        {...props}
      />
      {helperText && <div className="fs-select-helper-text">{helperText}</div>}
    </div>
  );
};
