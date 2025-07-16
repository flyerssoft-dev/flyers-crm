import React from 'react';
import { Row, Col } from 'antd';
import AnimatedNumber from 'components/animated-number';

const DashboardCard = ({ label, value, icon, className }) => {
	return (
		<Col span={4}>
			<Row className="dashboard_card">
				<Col span={24}>
					<Row align="top">
						<Col span={15}>
							<div className="value">
								<AnimatedNumber value={value} />
							</div>
							<div className="name">{label}</div>
						</Col>
						<Col span={9} className={`icon ${className || ''}`}>
							{icon}
						</Col>
					</Row>
				</Col>
			</Row>
		</Col>
	);
};

export default DashboardCard;
