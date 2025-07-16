import React from 'react';
import { DatePicker, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  onChange: (date: Dayjs | null, dateString: string | string[]) => void;
  showNow?: boolean;
  value?: Dayjs | null;
  showTime?: boolean;
  className?: string;
  disabledDate?: any;
  picker: 'date' | 'week' | 'month' | 'quarter' | 'year';
  disabled?: boolean;
  inputReadOnly?: boolean;
}

const FSCustomDatePicker: React.FC<CustomDatePickerProps> = ({
  onChange,
  value,
  showTime,
  className,
  disabledDate,
  picker,
  disabled,
  inputReadOnly,
}) => (
  <Space direction="vertical" size={12} className="w-full">
    <DatePicker
      use12Hours
      disabledDate={disabledDate}
      showTime={showTime}
      onChange={(date: Dayjs | null, dateString: string | string[]) => {
        onChange(date, dateString);
      }}
      showNow={false}
      showSecond={false}
      value={value ? dayjs(value) : null}
      className={className}
      picker={picker}
      disabled={disabled}
      inputReadOnly={inputReadOnly}
    />
  </Space>
);

export default FSCustomDatePicker;
