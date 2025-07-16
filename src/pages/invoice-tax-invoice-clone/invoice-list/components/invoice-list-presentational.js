import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Row, Col, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from 'components/table-component';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
// import PDFViewer from 'components/pdf-viewer';
import PdfViewIframe from 'components/pdf-viewer/pdf-viewer-iframe';

const InvoiceListPresentational = ({
	column,
	filteredData,
	pageSize,
	currentPage,
	tableLoading,
	selectedInvoice,
	setSelectedInvoice,
	rowSelection,
	selectedRowKeys,
	setSearchKey,
	selectedFile,
	setSelectedFile,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	return (
		<Row>
			<Col span={24} className="invoice_heading_container">
				<Row justify="space-between">
					<Col span={24}>
						<h4>Invoices</h4>
					</Col>
					<Col>
						<Row gutter={[10, 10]}>
							<Col xl={24}>
								<Row gutter={[10, 10]} align="middle">
									<Col>
										<Input
											placeholder="Search"
											suffix={<AiOutlineSearch />}
											onChange={({ target: { value } }) => setSearchKey(value)}
										/>
									</Col>
									{selectedRowKeys?.length === 1 ? (
										<Col>
											<Popconfirm
												title={`Are you sure to delete this Invoice?`}
												okText="Delete"
												cancelText="No"
												onConfirm={() => {
													let url = `${SERVER_IP}retail/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?._id}`;
													dispatch(deleteApi('DELETE_INVOICE', url));
												}}>
												<div style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }}>Delete</div>
											</Popconfirm>
										</Col>
									) : null}
								</Row>
							</Col>
						</Row>
					</Col>
					<Col>
						<Row gutter={[10, 10]}>
							<Col>
								<Button
									// onClick={() => setSelectedRecordToPrint(ROUTE_CONSTANTS.NEW_INVOICE)}
									onClick={() => navigate(ROUTE_CONSTANTS.NEW_INVOICE)}
									// icon={<PlusOutlined />}
									type="primary"
									style={{ width: '100%' }}>
									Create Invoice
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>
			<Col xl={24}>
				<Row style={{ padding: selectedInvoice ? 0 : '20px 10px' }} className="invoice">
					{selectedInvoice ? (
						<>
							<Col span={6} className="invoice_list_container">
								{filteredData?.map((data, index) => (
									<Row
										// onClick={() => setSelectedInvoice(data)}
										key={index}
										className={`invoice_list ${selectedInvoice?.invoice === data?.invoice ? 'selected' : ''}`}>
										<Col span={24}>
											<Row justify="space-between">
												<Col className="">{data?.customerName || ''}</Col>
												<Col className="">{data?.amount || ''}</Col>
											</Row>
										</Col>
										<Col span={24}>
											<Row align="middle" justify="space-between">
												<Col>
													<Row>
														<Col className="">
															<a href="/invoice">{data?.invoice || ''}</a>
														</Col>
														<Divider type="vertical" />
														<Col className="">{data?.amount || ''}</Col>
													</Row>
												</Col>
												<Col>{data?.status || ''}</Col>
											</Row>
										</Col>
									</Row>
								))}
							</Col>
							<Col span={18} className="invoice_viewer">
								<button onClick={() => setSelectedInvoice(null)} className="close">
									X
								</button>
							</Col>
						</>
					) : (
						<Col xl={24} md={24}>
							<TableComponent
								{...{
									onRow: (record, rowIndex) => {
										return {
											// onClick: (event) => {
											// 	setSelectedInvoice(record);
											// }, // click row
											onClick: (event) => navigate(`${ROUTE_CONSTANTS.INVOICE_DETAILS}/${record?._id}`),
											onDoubleClick: (event) => {}, // double click row
											onContextMenu: (event) => {}, // right button click row
											onMouseEnter: (event) => {}, // mouse enter row
											onMouseLeave: (event) => {}, // mouse leave row
										};
									},
									rowKey: (record) => record._id,
									style: { width: '100%' },
									loading: tableLoading,
									className: 'custom-table',
									dataSource: filteredData,
									rowSelection,
									columns: column,
									pagination: { current: currentPage, pageSize: pageSize, position: ['none', 'none'] },
									// ...(!!filteredData?.length && {
									// 	footer: () => (
									// 		<Row justify="space-between">
									// 			<Col md={16}>
									// 				{!!filteredData?.length &&
									// 					`Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}
									// 			</Col>
									// 			<Col md={8}>
									// 				<div style={{ textAlign: 'right' }}>
									// 					<Pagination
									// 						pageSizeOptions={intialPageSizeOptions}
									// 						defaultPageSize={initialPageSize}
									// 						showSizeChanger={true}
									// 						total={filteredData?.length}
									// 						onChange={handleTableChange}
									// 						responsive
									// 					/>
									// 				</div>
									// 			</Col>
									// 		</Row>
									// 	),
									// }),
								}}
							/>
						</Col>
					)}
				</Row>
			</Col>
			{/* <PDFViewer url={selectedFile} visible={!!selectedFile} onClose={() => setSelectedFile(null)} /> */}
			{/* {!!selectedFile && <PdfViewIframe url={selectedFile} visible={!!selectedFile} onClose={() => setSelectedFile(null)} />} */}
		</Row>
	);
};

export default InvoiceListPresentational;
