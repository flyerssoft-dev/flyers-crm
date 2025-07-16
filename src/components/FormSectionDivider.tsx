import { Divider, Row, Col } from 'antd';
import React from 'react';

interface FormSectionDividerProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  gutter?: [number, number];
}

const FullWidth: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

const FormSectionDivider: React.FC<FormSectionDividerProps> = ({
  title,
  children,
  className = '',
  gutter = [16, 24],
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {title && (
        <Divider orientation="center" className="font-semibold text-lg">
          {title}
        </Divider>
      )}
      <Row gutter={gutter}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;

          const isFullWidth = child.type === FullWidth;

          return (
            <Col xs={24} md={isFullWidth ? 24 : 12}>
              {child}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export { FormSectionDivider, FullWidth };
