import React, { useCallback } from 'react';
import moment from 'moment';
import { Button, Select, Modal, Drawer, Row, Col, Input, Form, Divider } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT, ITEM_TAX_TYPE, PLACE_OF_SUPPLY, SERIAL_TYPE } from 'constants/app-constants';
import { inWords } from 'services/Utils';
import AddSerialModal from 'components/add-serial-modal';
import FileUpload from 'components/file-upload';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const AddPurchasePresentational = ({
	state,
	setState,
	handleSubmit,
	columns,
	loading,
	editData,
	form,
	customers,
	isValid,
	totalAmount,
	roundOff,
	setCustomerAddModal,
	handleInputChange,
	selectedData,
	setSelectedData,
	tableData,
	setTableData,
	groupByColumns,
	groupData,
	paid,
	setPaid,
	balance,
	setShowAddressEditModal,
	selectedCustomer,
	handleSelectFile,
	fileList,
}) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				setState((state) => ({ ...state, visible: false }));
			},
			onCancel() {},
		});
	}, [setState]);

	return (
		<>
			<Drawer
				maskClosable={false}
				title={`${editData ? 'Edit' : 'Create'} Purchase`}
				placement="right"
				width={'100%'}
				open={state?.visible}
				destroyOnHidden
				className="add_purchase_drawer"
				onClose={showConfirm}
				footer={
					<Row>
						<Col
							xl={{
								span: 9,
								offset: 15,
							}}
							md={12}>
							<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
								<Col>
									<Button onClick={() => setState({ ...state, visible: false })}>Cancel</Button>
								</Col>
								<Col>
									<Button disabled={!isValid} loading={loading} type="primary" htmlType="submit" onClick={() => form.submit()}>
										{`${editData ? 'Update' : 'Submit'}`}
									</Button>
								</Col>
							</Row>
						</Col>
					</Row>
				}>
				<Row justify="start">
					<Col xl={24} md={24}>
						<TableComponent
							// summary={() => (
							// 	<Table.Summary fixed>
							// 	  <Table.Summary.Row>
							// 		<Table.Summary.Cell index={0}>Summary</Table.Summary.Cell>
							// 		<Table.Summary.Cell index={1}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={2}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={3}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={4}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={5}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={6}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={7}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={8}></Table.Summary.Cell>
							// 		<Table.Summary.Cell index={9}></Table.Summary.Cell>
							// 	  </Table.Summary.Row>
							// 	</Table.Summary>
							//   )}
							{...{
								columns,
								dataSource: tableData,
								pagination: false,
								footer: () => (
									<Row style={{ fontSize: 14 }}>
										<Col xl={18} md={18}>
											<Col xl={24} md={24} className="bold" style={{ paddingRight: 10 }}>
												Amount in words
											</Col>
											<Col xl={24} md={24}>
												{inWords(roundOff?.value)}
											</Col>
										</Col>
										<Col xl={6} md={6}>
											<Row>
												<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
													Sub Total
												</Col>
												<Col xl={1} md={1}>
													:
												</Col>
												<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
													{parseFloat(totalAmount).toFixed(2)}
												</Col>
											</Row>
											<Row>
												<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
													Round Off (+/-)
												</Col>
												<Col xl={1} md={1}>
													:
												</Col>
												<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
													{roundOff?.remain || 0}
												</Col>
											</Row>
											<Row>
												<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
													Grand Total
												</Col>
												<Col xl={1} md={1}>
													:
												</Col>
												<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
													{parseFloat(roundOff.value).toFixed(2)}
												</Col>
											</Row>
											{/* <Row align={'middle'}>
												<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
													Paid
												</Col>
												<Col xl={1} md={1}>
													:
												</Col>
												<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
													<Input 
														value={paid}
														onChange={(e) => setPaid(e.target.value)}
														placeholder="Paid Amount"
														style={{
															textAlign: 'right'
														}}
													/>
												</Col>
											</Row> */}
											<Row>
												<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
													Balance
												</Col>
												<Col xl={1} md={1}>
													:
												</Col>
												<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
													{parseFloat(balance).toFixed(2)}
												</Col>
											</Row>
										</Col>
									</Row>
								),
								title: () => (
									<Row justify="space-between">
										<Col xl={24} md={24}>
											<Form
												labelAlign="left"
												name="add-purchase"
												className="add-purchase required_in_right"
												form={form}
												onFinish={handleSubmit}
												{...layer1FormCol}>
												<Row gutter={[20, 20]} justify={'space-between'}>
													<Col xl={8} md={8}>
														<Form.Item
															label="Supplier"
															name="customerId"
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<Select
																allowClear
																showSearch
																optionFilterProp="children"
																filterOption={(input, option) =>
																	option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
																	option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
																}
																// disabled={!!editData}
																placeholder="Select Supplier"
																dropdownRender={(menu) => (
																	<div>
																		{menu}
																		<Divider />
																		<div
																			style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }}
																			onClick={() => setCustomerAddModal(true)}>
																			<a
																				href
																				style={{
																					flex: 'none',
																					color: '#188dfa',
																					padding: '8px',
																					display: 'block',
																				}}>
																				Add New Suppier
																			</a>
																		</div>
																	</div>
																)}>
																{customers?.map((customer) => (
																	<Select.Option value={customer._id}>{customer?.displayName}</Select.Option>
																))}
															</Select>
														</Form.Item>
														{selectedCustomer && (
															<div style={{ textAlign: 'right', marginTop: -10, fontSize: 12, fontWeight: 'bold' }}>
																Closing Balance: {selectedCustomer?.closingBalance}
															</div>
														)}
														<Form.Item
															label="GSTIN"
															name="gstin"
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Input placeholder="GSTIN" disabled className="labelInput" />
														</Form.Item>
														{/* <Form.Item
															label="Address"
															name="address"
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Row>
																<Col span={24} style={{ fontWeight: 'bold', marginBottom: 4 }}>
																	Billing Address
																	{selectedCustomer && <EditOutlined onClick={() => setShowAddressEditModal(true)} />}
																</Col>
																<Col span={24}>
																	<Input.TextArea
																		placeholder="Address"
																		disabled
																		className="labelInput"
																		rows={4}
																		value={form.getFieldValue('address')}
																	/>
																</Col>
															</Row>
														</Form.Item> */}

														<Form.Item
															label="Place of Supply"
															name="placeOfSupply"
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<Select placeholder="Place of Supply">
																{PLACE_OF_SUPPLY.map((type) => (
																	<Select.Option key={type} value={type?.toLocaleLowerCase()}>
																		{type}
																	</Select.Option>
																))}
															</Select>
														</Form.Item>
													</Col>
													<Col xl={7} md={7}>
														<Form.Item
															label="Bill No"
															name="billNumber"
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<Input placeholder="enter Bill No" />
														</Form.Item>
														<Form.Item
															label="Bill Date"
															name="billDate"
															initialValue={moment()}
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
														</Form.Item>
														<Form.Item
															label="Due Date"
															name="dueDate"
															initialValue={moment()}
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
														</Form.Item>
													</Col>
													<Col xl={8} md={8}>
														<Form.Item
															label="PO No"
															name="poNumber"
															initialValue={''}
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Input placeholder="enter PO No" />
														</Form.Item>
														<Form.Item
															label="Dispatch Through"
															name="dispatchThrough"
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Input placeholder="enter Dispatch Through" />
														</Form.Item>
														<Form.Item
															label="Tracking No"
															name="trackingNumber"
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Input placeholder="enter Tracking Number" />
														</Form.Item>
														{/* <div
															style={{
																position: 'absolute',
																bottom: 0,
																width: '80%',
															}}> */}
														<Form.Item
															label="Item Tax"
															name="taxPreference"
															initialValue={ITEM_TAX_TYPE[0]?.value}
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<Select
																onChange={(value) => handleInputChange('taxPreference', value)}
																placeholder="Select Item Tax Preference">
																{ITEM_TAX_TYPE?.map((itemTax) => (
																	<Select.Option value={itemTax?.value}>{itemTax?.label}</Select.Option>
																))}
															</Select>
														</Form.Item>
														{/* </div> */}
													</Col>
												</Row>
											</Form>
											<FileUpload maxFiles={2} handleSelectFile={handleSelectFile} fileList={fileList} />
										</Col>
									</Row>
								),
							}}
						/>
					</Col>
					<Col xl={15} md={15} style={{ paddingTop: 10 }}>
						<TableComponent
							{...{
								columns: groupByColumns,
								dataSource: groupData,
								pagination: false,
								className: 'custom-table',
							}}
						/>
					</Col>
				</Row>
				<AddSerialModal
					visible={!!selectedData}
					handleInputChange={handleInputChange}
					selectedData={selectedData}
					setSelectedData={setSelectedData}
					tableData={tableData}
					setTableData={setTableData}
				/>
			</Drawer>
		</>
	);
};

export default AddPurchasePresentational;
