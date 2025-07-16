import React from 'react';
import { Button, Pagination, Row, Col, Input, Tabs } from 'antd';
import { AiOutlineSearch, AiOutlineFileText, AiOutlineBarChart } from 'react-icons/ai';
import TableComponent from 'components/table-component';
import AddVoucher from 'pages/voucher/add-voucher';
import VoucherReport from './voucher-report';

const VoucherListPresentational = ({ column, filteredData, handleTableChange, getStartingValue, getEndingValue, pageSize, intialPageSizeOptions, initialPageSize, currentPage, refreshList, tableLoading, state, setState, setSearchKey }) => {
	const voucherTab = {
		label: (
			<span>
				<AiOutlineFileText style={{ marginRight: 6 }} />
				Vouchers
			</span>
		),
		key: '0',
		children: (
			<Row>
				<Col xl={24}>
					<TableComponent
						loading={tableLoading}
						className="custom-table"
						columns={column}
						rowKey={(record) => record._id}
						dataSource={filteredData}
						title={() => (
							<Row justify="space-between">
								<Col xl={3} md={3}>
									<Input placeholder="Search" suffix={<AiOutlineSearch />} style={{ height: '30px' }} onChange={({ target: { value } }) => setSearchKey(value)} />
								</Col>
								<Col xl={3} md={3}>
									<Button
										type="primary"
										style={{ height: '30px', width: '100%' }}
										onClick={() => {
											setState({
												...state,
												visible: true,
											});
										}}>
										Add Voucher
									</Button>
								</Col>
							</Row>
						)}
						pagination={{
							pageSize: pageSize,
							current: currentPage,
							position: ['none', 'none'],
						}}
						footer={() => (
							<Row justify="space-between">
								<Col>
									<div>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</div>
								</Col>
								<Col md={8}>
									<div style={{ textAlign: 'right' }}>
										<Pagination current={currentPage} pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
									</div>
								</Col>
							</Row>
						)}
					/>
				</Col>
				<AddVoucher {...{ state, setState, refreshList }} />
			</Row>
		),
	};

	const reportTab = {
		label: (
			<span>
				<AiOutlineBarChart style={{ marginRight: 6 }} />
				Vouchers Report
			</span>
		),
		key: '1',
		children: <VoucherReport />,
	};

	return (
		<Row style={{ padding: '20px 10px' }}>
			<Col span={24}>
				<Tabs defaultActiveKey="0" destroyInactiveTabPane items={[voucherTab, reportTab]} />
			</Col>
		</Row>
	);
};

export default VoucherListPresentational;
