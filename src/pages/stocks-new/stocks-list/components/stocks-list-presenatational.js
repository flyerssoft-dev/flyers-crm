import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Row, Col, Input, Tabs } from 'antd';
import TableComponent from 'components/table-component';
import StockTransaction from './stock-transaction-component';
import StockSerial from './stock-serial-component';

const { TabPane } = Tabs;

const TABS = [
	{
		tabName: 'Stock Serial',
		component: StockSerial,
	},
	{
		tabName: 'Items Transactions',
		component: StockTransaction,
	},
];

const StocksListPresentational = ({
	column,
	filteredData,
	pageSize,
	currentPage,
	tableLoading,
	selectedRow,
	setSearchKey,
	// handleTableChange,
	// getStartingValue,
	// getEndingValue,
	// intialPageSizeOptions,
	// initialPageSize,
	// stockType,
	// setStockType,
	// rowSelection,
	// selectedRowKeys,
}) => {
	return (
		<Row style={{ padding: '20px 10px' }} gutter={[10, 10]} className="new_stock_container">
			<Col xl={8} md={8}>
				<TableComponent
					loading={tableLoading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={filteredData}
					title={() => (
						<Row align={'middle'} justify={'space-between'} gutter={[10, 10]}>
							<Col span={24}>
								<Input
									style={{ borderWidth: 1.5, borderColor: '#66a4f7' }}
									placeholder="Search"
									suffix={<AiOutlineSearch />}
									onChange={({ target: { value } }) => setSearchKey(value)}
								/>
							</Col>
							{/* <Col span={24} style={{}}>
								<Radio.Group onChange={(e) => setStockType(e.target.value)} value={stockType}>
									<Radio value={"STOCK"}>Stock & Value</Radio>
									<Radio value={"SERIAL"}>Serialwise</Radio>
								</Radio.Group>
							</Col> */}
						</Row>
					)}
					{...{
						columns: column,
						pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
						...(!!filteredData?.length &&
							{
								// footer: () => (
								// 	<Row justify="space-between">
								// 		<Col md={16}>
								// 			{!!filteredData?.length &&
								// 				`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
								// 		</Col>
								// 		<Col md={8}>
								// 			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								// 				<Pagination
								// 					pageSizeOptions={intialPageSizeOptions}
								// 					defaultPageSize={initialPageSize}
								// 					showSizeChanger={true}
								// 					total={filteredData?.length}
								// 					onChange={handleTableChange}
								// 					responsive
								// 				/>
								// 			</div>
								// 		</Col>
								// 	</Row>
								// ),
							}),
					}}
				/>
			</Col>
			<Col xl={16} md={16}>
				<h5>{selectedRow?.itemName}</h5>
				<Tabs defaultActiveKey="0">
					{TABS.map(({ tabName, component }, index) => {
						const Component = component;
						return (
							<TabPane tab={tabName} key={index}>
								<Component selectedRow={selectedRow}/>
							</TabPane>
						);
					})}
				</Tabs>
			</Col>
		</Row>
	);
};

export default StocksListPresentational;
