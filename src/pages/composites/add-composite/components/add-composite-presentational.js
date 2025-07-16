import React, { useCallback } from 'react';
import moment from 'moment';
import { Button, Select, Modal, Drawer, Row, Col, Input, Form,
	//  Divider
	 } from 'antd';
import { ExclamationCircleOutlined, 
	// PlusOutlined 
} from '@ant-design/icons';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT } from 'constants/app-constants';
// import { inWords } from 'services/Utils';
import AddSerialModal from 'components/add-serial-modal';
const { Option } = Select;

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const AddCompositePresentational = ({
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
	items
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
		<AddSerialModal
			visible={!!selectedData}
			handleInputChange={handleInputChange}
			selectedData={selectedData}
			setSelectedData={setSelectedData}
			tableData={tableData}
			setTableData={setTableData}
		/>
			<Drawer
				maskClosable={false}
				title={`${editData ? 'Edit' : 'Create'} Composite`}
				placement="right"
				width={'40%'}
				open={state?.visible}
				destroyOnHidden
				className="add_inventory"
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
							{...{
								columns,
								dataSource: tableData,
								pagination: false,

								// footer: () => (
								// 	<Row style={{ fontSize: 18 }}>
								// 		<Col className="bold" style={{ paddingRight: 10 }}>
								// 			Total:
								// 		</Col>
								// 		<Col className="bold">{totalAmount}</Col>
								// 	</Row>
								// ),

								// footer: () => (
								// 	<Row style={{ fontSize: 14 }}>
								// 		<Col xl={18} md={18}>
								// 			<Col xl={24} md={24} className="bold" style={{ paddingRight: 10 }}>
								// 				Amount in words
								// 			</Col>
								// 			<Col xl={24} md={24}>
								// 				{inWords(roundOff?.value)}
								// 			</Col>
								// 		</Col>
								// 		<Col xl={6} md={6}>
								// 			<Row>
								// 				<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
								// 					Sub Total
								// 				</Col>
								// 				<Col xl={1} md={1}>
								// 					:
								// 				</Col>
								// 				<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
								// 					{parseFloat(totalAmount).toFixed(2)}
								// 				</Col>
								// 			</Row>
								// 			<Row>
								// 				<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
								// 					Round Off (+/-)
								// 				</Col>
								// 				<Col xl={1} md={1}>
								// 					:
								// 				</Col>
								// 				<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
								// 					{roundOff?.remain || 0}
								// 				</Col>
								// 			</Row>
								// 			<Row>
								// 				<Col xl={14} md={14} style={{ textAlign: 'right', paddingRight: 10 }}>
								// 					Grand Total
								// 				</Col>
								// 				<Col xl={1} md={1}>
								// 					:
								// 				</Col>
								// 				<Col xl={9} md={9} style={{ textAlign: 'right', fontWeight: 'bold' }}>
								// 					{parseFloat(roundOff?.value).toFixed(2)}
								// 				</Col>
								// 			</Row>
								// 		</Col>
								// 	</Row>
								// ),
								title: () => (
									<Row justify="space-between">
										<Col xl={24} md={24}>
											<Form
												labelAlign="left"
												name="add-inventory"
												className="required_in_right"
												form={form}
												onFinish={handleSubmit}
												{...layer1FormCol}>
												<Row gutter={[20, 20]}>
													<Col xl={24} md={24}>
														<Form.Item
															label="Item"
															name="itemId"
															rules={[
																{
																	required: true,
																	message: 'This Field is required!',
																},
															]}>
															<Select
																showSearch
																optionFilterProp="children"
																filterOption={(input, option) =>
																	option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
																	option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
																}
																disabled={!!editData}
																placeholder="Select Item"
																// dropdownRender={(menu) => (
																// 	<div>
																// 		{menu}
																// 		<Divider />
																// 		<div
																// 			style={{ display: 'flex', flexWrap: 'nowrap', cursor: 'pointer' }}
																// 			onClick={() => setCustomerAddModal(true)}>
																// 			<a
																// 				href
																// 				style={{
																// 					flex: 'none',
																// 					color: '#188dfa',
																// 					padding: '8px',
																// 					display: 'block',
																// 				}}>
																// 				<PlusOutlined /> Customer
																// 			</a>
																// 		</div>
																// 	</div>
																// )}
																>
																{items?.map((item) => (
																	<Option key={item?._id} value={item?._id}>
																		{item?.itemName}
																	</Option>
																))}
															</Select>
														</Form.Item>
														<Form.Item
															label="Date"
															name="date"
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
															label="Remarks"
															name="remarks"
															initialValue={''}
															rules={[
																{
																	required: false,
																	message: 'This Field is required!',
																},
															]}>
															<Input.TextArea placeholder="enter remarks" />
														</Form.Item>
													</Col>
												</Row>
											</Form>
										</Col>
									</Row>
								),
							}}
						/>
					</Col>
				</Row>
			</Drawer>
		</>
	);
};

export default AddCompositePresentational;
