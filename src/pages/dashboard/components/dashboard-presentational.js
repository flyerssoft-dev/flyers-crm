import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Tour, Tooltip } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiOutlineShopping } from 'react-icons/ai';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import AnimatedNumber from 'components/animated-number';
import PieChartCard from 'components/PieChartCard';
import BarChartCard from 'components/BarChartCard';
import ResponsiveAreaChartCard from 'components/ResponsiveAreaChartCard';
import SynchronizedLineChartCard from 'components/SynchronizedLineChartCard';
import DoughnutChartCard from 'components/DoughnutChartCard';
import ProgressiveLineChartCard from 'components/ProgressiveLineChartCard';
import IncomeExpenseCard from 'components/IncomeExpenseCard';
import TicketTable from './ticket-table';
import DashboardCard from './dashboard-card';

const DashboardPresentational = ({ dashboardData, tableData, loginRedux }) => {
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	const [tourOpen, setTourOpen] = useState(false);

	const steps = [
		{ title: 'Welcome to the Dashboard!', description: 'Monitor key stats.', target: () => ref1.current },
		{ title: 'Total Customers', description: 'Total number of customers.', target: () => ref1.current?.querySelector('.total-customers') },
		{ title: 'Total Suppliers', description: 'Total number of suppliers.', target: () => ref1.current?.querySelector('.total-suppliers') },
		{ title: 'Total Items', description: 'Total number of items.', target: () => ref1.current?.querySelector('.total-items') },
		{ title: 'To Be Paid', description: 'Total pending payables.', target: () => ref1.current?.querySelector('.to-be-paid') },
		{ title: 'Orders Overview', description: 'Latest order stats.', target: () => ref2.current },
	];

	useEffect(() => {
		setTimeout(() => {
			// setTourOpen(true);
		}, 500);
	}, []);

	const receivablesAging = dashboardData?.receivablesAging || [];
	const Component = receivablesAging.length > 0 ? Tooltip : React.Fragment;

	return (
		<>
			<Row className="dashboard_container">
				<Col xl={24}>
					<Row gutter={[10, 10]}>
						<Col className="title" span={24}>
							<h4>
								Hi there, {loginRedux?.firstName} {loginRedux?.lastName}! 👋
							</h4>
						</Col>

						<Col span={24} ref={ref1}>
							<Row gutter={[10, 10]}>
								{[
									{ label: 'Total Customers', value: dashboardData?.totalCustomers, icon: <BsFillPersonFill />, className: 'total-customers' },
									{ label: 'Total Suppliers', value: dashboardData?.totalSuppliers, icon: <BsFillPersonFill />, className: 'total-suppliers' },
									{ label: 'Total Items', value: dashboardData?.totalItems, icon: <PieChartOutlined />, className: 'total-items' },
								].map(({ label, value, icon, className }, index) => (
									<DashboardCard key={index} label={label} value={value} icon={icon} className={className} />
								))}

								{/* To Be Received – Green Gradient */}
								<Col span={4}>
									<Row className="dashboard_card gradient receive-card">
										<Col span={24}>
											<Component
												{...(receivablesAging.length > 0
													? {
															title: (
																<div>
																	{receivablesAging.map((item) => (
																		<div key={item._id}>
																			<strong>{item._id}:</strong> ₹{item.total}
																		</div>
																	))}
																</div>
															),
													  }
													: {})}>
												<Row align="top">
													<Col span={19}>
														<div className="value">{dashboardData?.formattedReceivables}</div>
														<div className="name">To Be Received</div>
													</Col>
													<Col span={5} className="icon">
														<FiArrowDownLeft />
													</Col>
												</Row>
											</Component>
										</Col>
									</Row>
								</Col>

								{/* To Be Paid – Red Gradient */}
								<Col span={4}>
									<Row className="dashboard_card gradient pay-card">
										<Col span={24}>
											<Row align="top">
												<Col span={19}>
													<div className="value">{dashboardData?.formattedPayables}</div>
													<div className="name">To Be Paid</div>
												</Col>
												<Col span={5} className="icon">
													<FiArrowUpRight />
												</Col>
											</Row>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>

						<Col span={24} ref={ref2}>
							<Row gutter={[10, 10]}>
								{dashboardData?.orders?.map((order, index) => (
									<Col key={index} span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={order?.count || 0} />
														</div>
														<div className="name">{order?._id || ''}</div>
													</Col>
													<Col span={5} className="icon">
														<AiOutlineShopping />
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
								))}
							</Row>
						</Col>
					</Row>
				</Col>

				{tableData?.length > 0 && (
					<Col xl={24} style={{ paddingTop: 20 }} ref={ref2}>
						<Row gutter={[10, 10]}>
							<Col span={24}>
								<h4>Tickets</h4>
								<TicketTable tableData={tableData} />
							</Col>
						</Row>
					</Col>
				)}
				<Col xl={24}>
					<Row gutter={[10, 0]}>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<BarChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<PieChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={24}>
					<Row gutter={[10, 0]}>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<ResponsiveAreaChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<ProgressiveLineChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={24}>
					<Row gutter={[10, 0]}>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<SynchronizedLineChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
						<Col xl={12} style={{ paddingTop: 20 }} className="chart-card">
							<Row gutter={[10, 10]}>
								<Col span={24}>
									<h4>Monthly</h4>
									<DoughnutChartCard title="Sales" />
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
				<Col xl={24}>
					<Row gutter={[10, 0]}>
						<Col xl={12} style={{ paddingTop: 20 }}>
							<IncomeExpenseCard title="Sales" />
						</Col>
					</Row>
				</Col>
			</Row>

			<Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={steps} />
		</>
	);
};

export default DashboardPresentational;
