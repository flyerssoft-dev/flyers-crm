import React, { useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { Popconfirm, Input, Button, Row, Col, Divider, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from 'components/table-component';
import { useNavigate } from 'react-router-dom';
import { ROUTE_CONSTANTS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { deleteApi } from 'redux/sagas/deleteApiSaga';
import { sendPostRequest } from 'redux/sagas/utils';
import { showToast } from 'helpers';
import { NOTIFICATION_STATUS_TYPES } from 'constants/app-constants';
import InfiniteLoader from 'components/infinite-loader';
import RandomInvoiceModal from './random-invoice-modal';

const TaxInvoiceListPresentational = ({
	column,
	filteredData,
	tableLoading,
	selectedInvoice,
	setSelectedInvoice,
	rowSelection,
	selectedRowKeys,
	setSearchKey,
	selectedFile,
	setSelectedFile,
	generateEInvoice,
	eInvoiceGenerating,
	generateEWayBill,
	eWayBillGenerating,
	selectedInvoiceData,
	refreshList,
	pageLoader,
	getStartingValue,
	getEndingValue,
	pageSize,
	currentPage,
	intialPageSizeOptions,
	initialPageSize,
	handleTableChange,
	enableEinvoice,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const [randomModalOpen, setRandomModalOpen] = useState(false);
	const [submittingRandom, setSubmittingRandom] = useState(false);

	const handleRandomSubmit = async (values) => {
		setSubmittingRandom(true);
		try {
			const payload = {
				...values,
				orgId: globalRedux.selectedOrganization._id,
			};

			if (values.selectedCustomers) {
				payload.customersManual = Object.entries(values.selectedCustomers)
					.filter(([, count]) => count > 0)
					.map(([customerId, noofInvoices]) => ({
						customerId,
						noofInvoices,
					}));
			}

			const response = await sendPostRequest({
				url: `${SERVER_IP}invoice/random`,
				body: payload,
			});

			if (response?.status === 200) {
				showToast('Success!', 'Random invoices generated', NOTIFICATION_STATUS_TYPES.SUCCESS);
				setRandomModalOpen(false);
				refreshList();
			} else {
				showToast('Failed!', 'Could not generate invoices', NOTIFICATION_STATUS_TYPES.ERROR);
			}
		} catch (error) {
			showToast('Error', error?.message || 'Something went wrong', NOTIFICATION_STATUS_TYPES.ERROR);
		} finally {
			setSubmittingRandom(false);
		}
	};

	const getPageLoaderText = () => {
		switch (pageLoader?.type) {
			case 'einvoice':
				return 'Generating E-Invoice...';
			case 'cancel_einvoice':
				return 'Cancelling E-Invoice...';
			case 'ewaybill':
				return 'Generating E-Way Bill...';
			case 'cancel_ewaybill':
				return 'Cancelling E-Way Bill...';
			default:
				return 'Processing...';
		}
	};

	return (
		<Row>
			{pageLoader?.generating && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						backgroundColor: 'rgba(255, 255, 255, 0.8)',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000,
					}}>
					<InfiniteLoader />
					<div style={{ marginTop: '12px', fontSize: '16px', fontWeight: 500, color: '#333' }}>{getPageLoaderText()}</div>
				</div>
			)}

			<Col span={24} className="invoice_heading_container">
				<Row justify="space-between">
					<Col span={24}>
						<h4>Tax Invoices</h4>
					</Col>
					<Col>
						<Row gutter={[10, 10]}>
							<Col xl={24}>
								<Row gutter={[10, 10]} align="middle">
									<Col>
										<Input placeholder="Search" suffix={<AiOutlineSearch />} onChange={({ target: { value } }) => setSearchKey(value)} />
									</Col>
									{selectedInvoiceData?.einvoiceStatus !== 'Generated' && selectedRowKeys?.length === 1 && (
										<Col>
											<Popconfirm
												title={`Are you sure to delete this Invoice?`}
												okText="Delete"
												cancelText="No"
												onConfirm={() => {
													let url = `${SERVER_IP}invoice/${selectedRowKeys?.[0]}?orgId=${globalRedux?.selectedOrganization?._id}`;
													dispatch(deleteApi('DELETE_TAX_INVOICE', url));
												}}>
												<div style={{ textDecoration: 'underline', color: 'red', cursor: 'pointer' }}>Delete</div>
											</Popconfirm>
										</Col>
									)}
									{selectedInvoiceData?.einvoiceStatus === 'Pending' && enableEinvoice && (
										<Col>
											<Button loading={pageLoader?.type === 'einvoice' && pageLoader?.generating} onClick={() => generateEInvoice(selectedRowKeys?.[0])} type="primary">
												Create E-Invoice
											</Button>
										</Col>
									)}
									{selectedInvoiceData?.einvoiceStatus === 'Generated' && selectedInvoiceData?.ewaybillStatus === 'Pending' && enableEinvoice && (
										<Col>
											<Button loading={pageLoader?.type === 'ewaybill' && pageLoader?.generating} onClick={() => generateEWayBill(selectedRowKeys?.[0])} type="primary">
												Create E-Way Bill
											</Button>
										</Col>
									)}
								</Row>
							</Col>
						</Row>
					</Col>

					<Col>
						<Row gutter={[10, 10]}>
							<Col>
								<Button onClick={() => navigate(ROUTE_CONSTANTS.NEW_TAX_INVOICE)} type="primary">
									Create Tax Invoice
								</Button>
							</Col>
							{enableEinvoice && (
								<Col>
									<Button onClick={() => setRandomModalOpen(true)}>Random</Button>
								</Col>
							)}
						</Row>
					</Col>
				</Row>
			</Col>

			<Col xl={24}>
				<Row style={{ padding: selectedInvoice ? 0 : '0' }} className="invoice">
					{selectedInvoice ? (
						<>
							<Col span={6} className="invoice_list_container">
								{filteredData?.map((data, index) => (
									<Row key={index} className={`invoice_list ${selectedInvoice?.invoice === data?.invoice ? 'selected' : ''}`}>
										<Col span={24}>
											<Row justify="space-between">
												<Col>{data?.customerName || ''}</Col>
												<Col>{data?.amount || ''}</Col>
											</Row>
										</Col>
										<Col span={24}>
											<Row justify="space-between" align="middle">
												<Col>
													<Row>
														<Col>
															<a href="/invoice">{data?.invoice || ''}</a>
														</Col>
														<Divider type="vertical" />
														<Col>{data?.amount || ''}</Col>
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
						<Col xl={24}>
							<TableComponent
								rowKey={(record) => record._id}
								style={{ width: '100%' }}
								loading={tableLoading}
								className="custom-table"
								dataSource={filteredData}
								rowSelection={rowSelection}
								columns={column}
								scroll={{ y: 'calc(100vh - 300px)' }}
								pagination={{
									current: currentPage,
									pageSize: pageSize,
									position: ['none', 'none'],
								}}
								onRow={(record) => ({
									onDoubleClick: () => {},
									onContextMenu: () => {},
									onMouseEnter: () => {},
									onMouseLeave: () => {},
								})}
								{...{
									...(!!filteredData?.length && {
										footer: () => (
											<Row justify="space-between" align={'middle'}>
												<Col span={12}>{!!filteredData?.length && `Showing ${getStartingValue()} - ${getEndingValue()} of ${filteredData?.length} Data`}</Col>
												<Col
													span={12}
													style={{
														display: 'flex',
														justifyContent: 'flex-end',
														alignItems: 'center',
													}}>
													<div style={{ textAlign: 'right' }}>
														<Pagination pageSizeOptions={intialPageSizeOptions} defaultPageSize={initialPageSize} showSizeChanger={true} total={filteredData?.length} onChange={handleTableChange} responsive />
													</div>
												</Col>
											</Row>
										),
									}),
								}}
							/>
						</Col>
					)}
				</Row>
			</Col>

			<RandomInvoiceModal visible={randomModalOpen} onCancel={() => setRandomModalOpen(false)} onSubmit={handleRandomSubmit} confirmLoading={submittingRandom} />
		</Row>
	);
};

export default TaxInvoiceListPresentational;
