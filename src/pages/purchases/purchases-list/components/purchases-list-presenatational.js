import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Row, Col, Button, Input } from 'antd';
import TableComponent from 'components/table-component';
import AddPurchase from 'pages/purchases/add-purchase';
import ItemsModal from './items-modal';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import { renderTableFooter } from 'pages/customers/customer-list/components/customer-list-presentational';
import PurchaseDetails from './purchase-details';

const PurchasesListPresentational = ({
	column,
	filteredData,
	handleTableChange,
	pageSize,
	intialPageSizeOptions,
	initialPageSize,
	currentPage,
	refreshList,
	tableLoading,
	state,
	setState,
	editData,
	setSearchKey,
	rowSelection,
	selectedRowKeys,
	selectedViewRow,
	setSelectedViewRow,
	selectedPurchaseDetails,
	getStartingValue,
	getEndingValue,
}) => {
	const navigate = useNavigate();
	const location = useLocation();

	// Get current query params
	const queryParams = queryString.parse(location.search);
	const selectedPurchase = queryParams.selectedPurchase;
	console.log('🚀 ~ selectedPurchase:', selectedPurchase);

	// Handle row click to update query param
	const handleRowClick = (record) => {
		const newQueryParams = {
			...queryParams,
			selectedPurchase: record._id, // Set the selected customer ID
		};
		navigate(`?${queryString.stringify(newQueryParams)}`, { replace: false });
	};
	return (
		<Row>
			<Col span={selectedPurchase ? 6 : 24} style={{ padding: 0 }}>
				<TableComponent
					loading={tableLoading}
					rowSelection={rowSelection}
					className="custom-table"
					style={{ width: '100%' }}
					columns={column}
					bordered
					rowKey={(record) => record._id}
					dataSource={filteredData}
					scroll={{ y: selectedPurchase ? 'calc(100vh - 220px)' : 'calc(100vh - 260px)' }}
					onRow={(record) => ({
						onClick: () => handleRowClick(record),
						style: {
							backgroundColor: selectedPurchase === record._id ? '#e6f7ff' : 'inherit',
							cursor: 'pointer',
						},
					})}
					{...(selectedPurchase
						? {}
						: {
								title: () => (
									<Row justify="space-between">
										<Col span={8}>
											<Row gutter={[10, 10]}>
												<Col span={24}>
													<Row gutter={[10, 10]} align="middle">
														<Col>
															<Input
																placeholder="Search"
																suffix={<AiOutlineSearch />}
																onChange={({ target: { value } }) => setSearchKey(value)}
															/>
														</Col>
													</Row>
												</Col>
											</Row>
										</Col>

										<Col>
											<Button
												type="primary"
												onClick={() =>
													setState({
														...state,
														visible: true,
													})
												}>
												Create Purchase
											</Button>
										</Col>
									</Row>
								),
						  })}
					pagination={{
						current: currentPage,
						pageSize: pageSize,
						position: ['none', 'none'],
					}}
					footer={() =>
						renderTableFooter(
							selectedPurchase,
							filteredData,
							handleTableChange,
							intialPageSizeOptions,
							initialPageSize,
							getStartingValue,
							getEndingValue
						)
					}
				/>
			</Col>
			{selectedPurchase && (
				<Col span={18} style={{ padding: 20 }}>
					<div style={{ width: '100%', textAlign: 'right' }}>
						<button
							style={{
								backgroundColor: '#357edd',
								border: 'none',
								borderRadius: '4px',
								color: '#ffffff',
								cursor: 'pointer',
								padding: '8px',
							}}
							onClick={() => navigate('/purchases')}>
							Close
						</button>
					</div>
					<PurchaseDetails selectedPurchase={selectedPurchaseDetails} />
				</Col>
			)}
			<AddPurchase {...{ state, setState, refreshList, editData }} />
			<ItemsModal {...{ setSelectedViewRow, selectedViewRow }} />
		</Row>
	);
};

export default PurchasesListPresentational;
