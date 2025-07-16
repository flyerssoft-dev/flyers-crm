import React, { useCallback } from 'react';
import { Button, Select, Modal, Drawer, Row, Col, Form, Input, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import TableComponent from 'components/table-component';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT } from 'constants/app-constants';

const { confirm } = Modal;

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const AddLoadInPresentational = ({
	state,
	setState,
	handleSubmit,
	columns,
	loading,
	tableData,
	debounceFn,
	searchList,
	handleChange,
	totalAmount,
	receiptState,
	setReceiptState,
	editData,
	form,
}) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const vehicles = useSelector((state) => globalRedux?.vehicles);
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
		<Drawer
			maskClosable={false}
			title={`${editData ? 'Edit' : 'Add New'} Unload`}
			placement="right"
			width={'80%'}
			open={state?.visible}
			destroyOnHidden
			className="add_student"
			onClose={showConfirm}
			footer={
				<Row>
					<Col
						xl={{
							span: 8,
							offset: 16,
						}}
						md={12}>
						<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
							<Col>
								<Button onClick={() => setState({ ...state, visible: false })}>Cancel</Button>
							</Col>
							<Col>
								<Button loading={loading} type="primary" htmlType="submit" onClick={form.submit}>
									Submit
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			}>
			<Row justify="center">
				<Col xl={23} md={23}>
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
							title: () => (
								<Row justify="space-between">
									<Col xl={24} md={24}>
										<Form name="add-load-in" style={{}} form={form} onFinish={handleSubmit} {...layer1FormCol}>
											<Row gutter={[10, 10]} style={{ width: '100%' }}>
												<Col xl={6} md={6}>
													<Form.Item
														label="Vehicle"
														name="vehicleId"
														initialValue={editData?.vehicleId}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Select>
															{vehicles?.map((vehicle) => (
																<Select.Option value={vehicle._id}>{vehicle?.vehicleName}</Select.Option>
															))}
														</Select>
													</Form.Item>
												</Col>
												<Col xl={6} md={6}>
													<Form.Item
														label="Load Date"
														name="loadDate"
														initialValue={editData?.loadDate}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
													</Form.Item>
												</Col>
												<Col xl={6} md={6}>
													<Form.Item
														label="Driver Name"
														name="driverName"
														initialValue={editData?.driverName}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<Input />
													</Form.Item>
												</Col>
												<Col xl={6} md={6}>
													<Form.Item
														label="Driver Mobile"
														name="driverMobile"
														initialValue={editData?.driverMobile}
														rules={[
															{
																required: true,
																message: 'This Field is required!',
															},
														]}>
														<InputNumber style={{ width: '100%' }} />
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
			{/* <Row className="space-between" style={{ paddingTop: 20 }}>
				<Button loading={loading} onClick={form.submit} style={{ marginRight: '10px', width: '49%' }} type="primary" htmlType="submit">
					Save
				</Button>
				<Button danger style={{ width: '49%' }}>
					Cancel
				</Button>
			</Row> */}
		</Drawer>
	);
};

export default AddLoadInPresentational;
