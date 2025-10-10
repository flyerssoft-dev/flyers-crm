import React from 'react';
import { Col, Row } from 'antd';
import LottieFile from 'assets/lottie-files';
import LottieComponent from './lottie-component';

const NoAccess = () => {
	return (
		<Row
			justify="center"
			align="middle"
			style={{
				height: '100%',
				padding: 20,
			}}>
			<Col span={24}>
				<LottieComponent width={'60%'} file={LottieFile.UnderConstruction} />
			</Col>
		</Row>
	);
};

export default NoAccess;
