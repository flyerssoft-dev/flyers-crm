import React from 'react';
import { Col, Layout, Row } from 'antd';
// import { CommentOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import LottieFile from 'assets/lottie-files';
import Sidebar from './side-bar';
import PageHeader from './page-header';
import LottieComponent from './lottie-component';

const { Content } = Layout;

const PageLayout = () => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	React.useEffect(() => {
		if (globalRedux?.selectedOrganization?.id) {
			// dispatch(getApi('GET_VOUCHERS_HEAD', `${SERVER_IP}voucherhead/?orgId=${globalRedux.selectedOrganization._id}`));
			dispatch(getApi('GET_TAXES', `${SERVER_IP}tax`));
		}
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	// useEffect(() => {
	// 	setTimeout(() => {
	// 		setIsLoading(false);
	// 	}, 2000);
	// }, []);

	return (
		<Layout style={{ height: '100vh' }}>
			<Row className={`loader`} style={{}} align="middle">
				{/* <Row className={`loader ${!isLoading ? 'hide' : ''}`} style={{}} align="middle"> */}
				<Col span={24}>
					<LottieComponent file={LottieFile.Loading} width="15%" height="15%" />
				</Col>
			</Row>
			<Sidebar />
			<Layout style={{ backgroundColor: '#fff', overflow: 'auto', height: '100vh' }}>
				<Content>
					<PageHeader />
					<div className="overflow-scroll">
						<Outlet />
					</div>
					{/* <FloatButton.Group trigger="click" type="primary" style={{ right: 24 }} icon={<CustomerServiceOutlined />}>
						<FloatButton />
						<FloatButton icon={<CommentOutlined />} />
					</FloatButton.Group> */}
				</Content>
			</Layout>
		</Layout>
	);
};

export default PageLayout;
