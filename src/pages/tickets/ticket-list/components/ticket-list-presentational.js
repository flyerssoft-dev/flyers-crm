import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Input, Button, Pagination, Row, Col, Select, Switch, Tabs } from 'antd';
import TableComponent from 'components/table-component';
import AddTicket from 'pages/tickets/add-ticket';
import { camelize } from 'helpers';
import TicketDetail from 'pages/tickets/ticket-details';
import AssignToModal from './assignto-modal';
import { STATUS_DROPDOWN } from 'constants/app-constants';
import { CustomCountdownCircleTimer } from 'components/circle-timer';
import { ReloadOutlined } from '@ant-design/icons';

const TicketListPresentational = ({
	column,
	filteredData,
	visible,
	toggleVisible,
	handleTableChange,
	getStartingValue,
	getEndingValue,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	currentPage,
	setSearchKey,
	refreshList,
	tableLoading,
	rowSelection,
	users,
	setSelectedAssignedTo,
	selectedStatus,
	setSelectedStatus,
	selectedTicket,
	setSelectedTicket,
	selectedTicketId,
	navigate,
	autoRefresh,
	setAutoRefresh,
	getTickets,
}) => {
	return (
		<Row className="ticket_list_container">
			<Col span={24} style={{ padding: '0 20px' }}>
				<Row>
					<Col span={24}>
						<Row gutter={[10, 10]} justify="center" align="middle">
							<Col xl={7}>
								<Row gutter={[10, 10]} justify="center" align="middle">
									<Col xl={12}>
										<Input placeholder="Search by ticket type, description, ticket no." suffix={<AiOutlineSearch />} style={{ height: '30px' }} onChange={({ target: { value } }) => setSearchKey(value)} />
									</Col>
									<Col xl={12}>
										<Select allowClear style={{ width: '100%' }} placeholder="Assigned to" onChange={(value) => setSelectedAssignedTo(value)}>
											{users?.map((user) => (
												<Select.Option key={user?.userId} value={user?.userId}>
													{user?.firstName || '-'} {user?.lastName || '-'}
												</Select.Option>
											))}
										</Select>
									</Col>
								</Row>
							</Col>
							<Col xl={3}></Col>
							<Col xl={10} className="auto-refresh-area-container">
								<Switch defaultChecked onChange={setAutoRefresh} checked={autoRefresh} />{' '}
								<span style={{ fontWeight: 'bold' }} className="text">
									Auto Refresh
								</span>
								<div style={{ opacity: 1, width: 30 }}>
									{autoRefresh ? (
										<CustomCountdownCircleTimer
											isPlaying
											size={30}
											strokeWidth={4}
											duration={60}
											onComplete={() => {
												getTickets();
												return { shouldRepeat: true };
											}}>
											{({ remainingTime }) => remainingTime}
										</CustomCountdownCircleTimer>
									) : (
										<Button type="primary" icon={<ReloadOutlined />} loading={tableLoading} onClick={getTickets} />
									)}
								</div>
								<AssignToModal {...{ users, rowSelection, refreshList }} />
							</Col>
							<Col xl={4}>
								<Button
									type="primary"
									style={{ width: '100%' }}
									onClick={() => {
										toggleVisible(true);
									}}>
									Create Ticket
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>

				<Tabs
					defaultActiveKey="0"
					items={STATUS_DROPDOWN.map((tabName, index) => ({
						label: `${tabName} (${filteredData?.filter((data) => data?.status === tabName)?.length || 0})`,
						key: String(index),
						children: (
							<TableComponent
								rowSelection={rowSelection}
								loading={tableLoading}
								className="custom-table ticket"
								style={{ width: '100%' }}
								columns={column}
								rowKey={(record) => record._id}
								dataSource={filteredData?.filter((data) => data?.status === tabName)}
								rowClassName={(record) => camelize(record?.status)}
								onRow={(record) => ({
									onClick: () => navigate(`/ticket/${record._id}`),
								})}
								pagination={{
									current: currentPage,
									pageSize: pageSize,
									position: ['none', 'none'],
								}}
								footer={() => (
									<Row>
										<Col span={12}>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</Col>
										<Col span={12}>
											<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
												<Pagination pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
											</div>
										</Col>
									</Row>
								)}
							/>
						),
					}))}
				/>
			</Col>

			<AddTicket {...{ visible, toggleVisible, refreshList }} />
			<TicketDetail {...{ visible: !!selectedTicketId, closeModal: () => navigate(-1) }} />
		</Row>
	);
};

export default TicketListPresentational;
