import React, { useRef, 
	// useState,
	 useEffect } from 'react';
import {
	Row,
	Col,
	// Tour,
	// Select
} from 'antd';
import {
	// LineChartOutlined,
	// WarningOutlined,
	PieChartOutlined,
} from '@ant-design/icons';
import { BsFillPersonFill } from 'react-icons/bs';
import { AiOutlineShopping } from 'react-icons/ai';
import { FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
// import { LineChartGradient } from 'components/charts/line-chart';
// import { generateGreetings } from 'helpers';
import AnimatedNumber from 'components/animated-number';
import TicketTable from './ticket-table';

const DashboardPresentational = ({ dashboardData, tableData, loginRedux, branches, setSelectedBranchId }) => {
	// const [open, setOpen] = useState(false);
	const ref1 = useRef(null);
	const ref2 = useRef(null);
	//   const ref3 = useRef(null);

	useEffect(() => {
		setTimeout(() => {
			// setOpen(true);
		}, 500);
	}, []);

	// const steps = [
	// 	{
	// 		title: 'Upload File',
	// 		description: 'Put your files here.',
	// 		cover: <img alt="tour.png" src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png" />,
	// 		target: () => ref1.current,
	// 	},
	// 	{
	// 		title: 'Save',
	// 		description: 'Save your changes.',
	// 		target: () => ref2.current,
	// 	},
	// ];
	return (
		<Row className="dashboard_container">
			<Col xl={24}>
				<Row gutter={[10, 10]}>
					<Col className="title" span={24} style={{ fontWeight: 'normal' }}>
						<Row>
							<Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
								<h4>
									Hi there, {loginRedux?.firstName} {loginRedux?.lastName}! 👋
								</h4>
								{/* <div>
									{generateGreetings()}! {loginRedux?.firstName} {loginRedux?.lastName}
								</div> */}
							</Col>
							{/* <Col span={12} style={{ textAlign: 'right' }}>
								<Select
									placeholder="Select Branch"
									allowClear
									style={{ width: 150 }}
									onChange={(value) => setSelectedBranchId?.(value)}>
									{branches?.map((branch) => (
										<Select.Option key={branch?._id} value={branch?._id}>
											{branch?.areaName}
										</Select.Option>
									))}
								</Select>
							</Col> */}
						</Row>
					</Col>

					<Col span={24} ref={ref1}>
						<Row gutter={[10, 10]}>
							<Col span={24}>
								<Row gutter={[10, 10]}>
									<Col span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={dashboardData?.totalCustomers} />
														</div>
														<div className="name">Total Customers</div>
													</Col>
													<Col span={5} className="icon">
														<BsFillPersonFill />
													</Col>
												</Row>
											</Col>
											{/* <Col span={24} className="desc">
										Customers in this app
									</Col> */}
										</Row>
									</Col>
									<Col span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={dashboardData?.totalSuppliers} />
														</div>
														<div className="name">Total Suppliers</div>
													</Col>
													<Col span={5} className="icon">
														<BsFillPersonFill />
													</Col>
												</Row>
											</Col>
											{/* <Col span={24} className="desc">
										Suppliers in this app
									</Col> */}
										</Row>
									</Col>
									<Col span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={dashboardData?.totalItems} />
														</div>
														<div className="name">Total Items</div>
													</Col>
													<Col span={5} className="icon">
														<PieChartOutlined />
													</Col>
												</Row>
											</Col>
											{/* <Col span={24} className="desc">
										Items in this app
									</Col> */}
										</Row>
									</Col>
									<Col span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={dashboardData?.totalSuppliers} />
														</div>
														<div className="name">To Be Received</div>
													</Col>
													<Col span={5} className="icon">
														<FiArrowDownLeft />
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
									<Col span={4}>
										<Row className="dashboard_card">
											<Col span={24}>
												<Row align="top">
													<Col span={19}>
														<div className="value">
															<AnimatedNumber value={dashboardData?.totalSuppliers} />
														</div>
														<div className="name">To Be Paid</div>
													</Col>
													<Col span={5} className="icon red">
														<FiArrowUpRight />
													</Col>
												</Row>
											</Col>
										</Row>
									</Col>
									{/* <Col span={5}>
								<Row className="dashboard_card">
									<Col span={24}>
										<Row align="top">
											<Col span={19}>
												<div className="value">
													<AnimatedNumber value={dashboardData?.totalTickets?.length} />
												</div>
												<div className="name">Total Tickets</div>
											</Col>
											<Col span={5} className="icon">
												<PieChartOutlined />
											</Col>
										</Row>
									</Col>
									<Col span={24} className="desc">
										Tickets in this app
									</Col>
								</Row>
							</Col> */}
								</Row>
							</Col>
							<Col span={24}>
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
												{/* <Col span={24} className="desc">
										Customers in this app
									</Col> */}
											</Row>
										</Col>
									))}
								</Row>
							</Col>
						</Row>
					</Col>

					{/* <Col className="title" span={24} style={{ fontWeight: 'normal' }}>
						<Row>
							<Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
								<div>Tickets</div>
							</Col>
						</Row>
					</Col>
					<Col span={24}>
						<Row gutter={[10, 10]}>
							{dashboardData?.totalTickets?.map((data) => (
								<Col span={5}>
									<Row className="dashboard_card">
										<Col span={24}>
											<Row align="top">
												<Col span={19}>
													<div className="value">
														<AnimatedNumber value={data?.count} />
													</div>
													<div className="name">{data?._id} Tickets</div>
												</Col>
												<Col span={5} className="icon">
													<PieChartOutlined />
												</Col>
											</Row>
										</Col>
										<Col span={24} className="desc">
											{data?._id} Tickets in this app
										</Col>
									</Row>
								</Col>
							))}
						</Row>
					</Col> */}

					{(tableData || [])?.length > 0 ? (
						<Col xl={24} style={{ paddingTop: 20 }} ref={ref2}>
							<Row gutter={[10, 10]}>
								<Col xl={24} style={{ paddingTop: 20 }}>
									<Row gutter={[10, 10]}>
										<Col className="title" span={24} style={{ fontWeight: 'normal' }}>
											<div>Tickets</div>
										</Col>
									</Row>
								</Col>
								<Col className="title" span={14}>
									<TicketTable tableData={tableData} />
								</Col>
							</Row>
						</Col>
					) : null}
					{/* <Col xl={24} style={{ paddingTop: 20 }}>
						<Row gutter={[10, 10]}>
							<Col xl={24} style={{ paddingTop: 20 }}>
								<Row gutter={[10, 10]}>
									<Col className="title" span={24}>
										Payment History
									</Col>
								</Row>
							</Col>
							<Col
								className="title"
								span={16}
								style={{
									padding: '20px 0',
								}}>
								<Col>
									<table className="bordered-bottom" id="payments">
										<tr>
											<th>
												<span style={{ paddingRight: 5 }}>RECENT PAYMENTS</span> <ReloadOutlined />
											</th>
											<th></th>
											<th></th>
											<th style={{ textAlign: 'right' }}>ALL PAYMENTS</th>
										</tr>
										{Array(5)
											.fill('')
											.map((data) => (
												<tr>
													<td>about 2 years</td>
													<td>CCTV</td>
													<td>Ravi Chandran</td>
													<td style={{ textAlign: 'right' }}>₹1,200</td>
												</tr>
											))}
									</table>
								</Col>
							</Col>
						</Row>
					</Col> */}
					{/* <Col xl={24} style={{ paddingTop: 20 }}>
						<Row gutter={[10, 10]}>
							<Col xl={24} style={{ paddingTop: 20 }}>
								<Row gutter={[10, 10]}>
									<Col className="title" span={24}>
										Amount Collection history
									</Col>
									{dashboardData?.areaSummary?.map((areaSummary) => (
										<Col span={5}>
											<Row className="dashboard_card">
												<Col span={24} className="icon">
													<LineChartOutlined />
												</Col>
												<Col
													span={24}
													style={{
														fontSize: '1.3rem',
														lineHeight: 'normal',
														// minHeight: 60,
														padding: '10px 0',
														display: 'flex',
														alignItems: 'center',
													}}
													className="value">
													{areaSummary?.areaName}
												</Col>
												<Col span={24} className="name">
													Total Cust. :{' '}
													<span style={{ fontWeight: 'bold' }}>
														<AnimatedNumber value={areaSummary?.totalCustomers} />
													</span>
												</Col>
												<Col span={24} className="name">
													Active Cust. :{' '}
													<span style={{ fontWeight: 'bold' }}>
														<AnimatedNumber value={areaSummary?.activeCustomers} />
													</span>
												</Col>
												<Col span={24} className="name" style={{ color: '#d52b1e' }}>
													Pending Amnt. :{' '}
													<span style={{ fontWeight: 'bold' }}>
														<AnimatedNumber value={areaSummary?.PendingAmount} />
													</span>
												</Col>
											</Row>
										</Col>
									))}
								</Row>
							</Col>
							<Col
								className="title"
								span={24}
								style={{
									padding: '20px 0',
								}}>
								<LineChartGradient />
							</Col>
						</Row>
					</Col> */}
				</Row>
			</Col>
			{/* <Tour open={open} onClose={() => setOpen(false)} steps={steps} /> */}
		</Row>
	);
};

export default DashboardPresentational;
