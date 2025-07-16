import React from 'react';
import { Form, FormItemProps } from 'antd';

const FSFormItemWrapper: React.FC<FormItemProps> = ({
  children,
  label = '',
  name,
  required = false,
  wrapperCol = { xs: 24, sm: 18 },
  labelCol = { xs: 24, sm: 6 },
  labelAlign = 'left',
  className = 'w-full mb-0',
  ...rest
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      className={className}
      rules={[
        {
          required,
          message: `Please ${required ? 'enter' : 'select'} the ${String(label).toLowerCase()}`,
        },
      ]}
      labelCol={labelCol}
      wrapperCol={wrapperCol}
      labelAlign={labelAlign}
      {...rest}
    >
      {children}
    </Form.Item>
  );
};

export default FSFormItemWrapper;
