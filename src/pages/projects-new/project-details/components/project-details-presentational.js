import React from 'react';
import { Col, Row, Spin, Tabs } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { API_STATUS } from 'constants/app-constants';
import Overview from './overview';
import Images from './images';
import Files from './files';
import Accounts from './accounts';
import Logs from './logs';
import Notes from './notes';
import Tasks from './tasks';

const { TabPane } = Tabs;

const MASTER_TAB = [
	{
		tabName: 'Details',
		component: Overview,
	},
	{
		tabName: 'Files',
		component: Files,
	},
	{
		tabName: 'Images',
		component: Images,
	},
	{
		tabName: 'Accounts',
		component: Accounts,
	},
	{
		tabName: 'Logs',
		component: Logs,
	},
];

const RIGHT_TAB = [
	{
		tabName: 'Tasks',
		component: Tasks,
	},
	{
		tabName: 'Notes',
		component: Notes,
	},
];

const ProjectDetailsPresentational = () => {
	// const projectDetails = useSelector((state) => state.projectRedux?.projectDetails);
	const globalRedux = useSelector((state) => state.globalRedux);
	const loading = globalRedux.apiStatus.GET_PROJECTS_DETAILS === API_STATUS.PENDING;

	const [
		searchParams,
		// setSearchParams
	] = useSearchParams();
	const page = searchParams.get('key');
	console.log('🚀 ~ ProjectDetailsPresentational ~ searchParams:', page);
	return (
		// <Drawer
		// 	maskClosable={false}
		// 	title={
		// 		<Row gutter={[10, 10]}>
		// 			{loading ? (
		// 				<Col
		// 					style={{
		// 						fontSize: '1.2rem',
		// 					}}>
		// 					Loading details...
		// 				</Col>
		// 			) : (
		// 				<>
		// 					<Col
		// 						span={24}
		// 						style={{
		// 							fontSize: '1.2rem',
		// 						}}>{`${projectDetails?.title} - ${projectDetails?.customerId?.displayName}`}</Col>
		// 					<Col span={24}>
		// 						<Tag color="blue">{projectDetails?.status}</Tag>
		// 					</Col>
		// 				</>
		// 			)}
		// 		</Row>
		// 	}
		// 	placement="right"
		// 	width={'50%'}
		// 	open={visible}
		// 	className="project_detail_drawer"
		// 	onClose={closeModal}>
		<Row className="project_details_container">
			<Col span={24}>
				<Row style={{ padding: 0 }} className="ticket">
					<Col span={24} className="project_details_viewer">
						{loading ? (
							<Row
								style={{
									height: '30vh',
									width: '100%',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
								<Col>
									<Spin />
								</Col>
							</Row>
						) : (
							<Tabs
								type="card"
								// defaultActiveKey="0"
								// activeKey={page}
								// onChange={(key) => {
								// 	setSearchParams({ key });
								// }}
								// tabPosition={'left'}
								style={{ height: '100%' }}>
								{MASTER_TAB.map(({ tabName, component }, index) => {
									const Component = component;
									return (
										<TabPane tab={tabName} key={index}>
											{loading ? (
												<Row justify={'center'} align={'middle'}>
													<Col>
														<Spin />
													</Col>
												</Row>
											) : (
												<Component />
											)}
										</TabPane>
									);
								})}
							</Tabs>
						)}
					</Col>
				</Row>
			</Col>
			{/* <Col xl={8} className="right_content_area">
				<Tabs style={{ height: '100%' }}>
					{RIGHT_TAB.map(({ tabName, component }, index) => {
						const Component = component;
						return (
							<TabPane tab={tabName} key={index}>
								{loading ? (
									<Row justify={'center'} align={'middle'}>
										<Col>
											<Spin />
										</Col>
									</Row>
								) : (
									<Component />
								)}
							</TabPane>
						);
					})}
				</Tabs>
			</Col> */}
		</Row>
		// </Drawer>
	);
};

export default ProjectDetailsPresentational;
