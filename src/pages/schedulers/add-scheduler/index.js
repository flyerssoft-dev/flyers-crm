import React, { useEffect } from 'react';
import { Row, Input, Button, Form, Select, InputNumber, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import DatePicker from 'components/date-picker';
import { API_STATUS, DATE_FORMAT, SCHEDULER_TYPE } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import moment from 'moment';

const AddScheduler = ({ schedulerAddModal, width = '40%', editScheduler, setSchedulerAddModal, refreshList, handleClose }) => {
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const customers = useSelector((state) => state.customerRedux?.customers || []);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editScheduler) {
			form.setFieldsValue({
				customerId: editScheduler?.customerId?._id,
				date: moment(editScheduler?.date),
				scheduleType: editScheduler?.scheduleType,
				refNumber: editScheduler?.refNumber,
				amount: editScheduler?.amount,
				dueDate: moment(editScheduler?.dueDate),
				remarks: editScheduler?.remarks,
			});
		} else {
			form?.resetFields();
		}
	}, [editScheduler, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?.id,
			...values,
		};

		if (!editScheduler) {
			dispatch(postApi(data, 'ADD_SCHEDULER'));
		} else {
			let url = `${SERVER_IP}scheduler/${editScheduler._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_SCHEDULER', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_SCHEDULER === 'SUCCESS' || globalRedux.apiStatus.EDIT_SCHEDULER === 'SUCCESS') {
			dispatch(resetApiStatus(editScheduler ? 'EDIT_SCHEDULER' : 'ADD_SCHEDULER'));
			refreshList?.();
			handleClose?.();
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editScheduler, setSchedulerAddModal, dispatch, refreshList, handleClose, form]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_SCHEDULER === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SCHEDULER === API_STATUS.PENDING;

	return (
		<Drawer
			placement="right"
			title={`${editScheduler ? 'Edit' : 'New'} Scheduler`}
			width={width || '40%'}
			open={schedulerAddModal}
			closable
			onClose={() => setSchedulerAddModal(false)}
			destroyOnHidden={true}>
			<Row style={{ marginTop: 0 }}>
				<Form
					name="add-scheduler"
					className="required_in_right"
					style={{ width: '100%' }}
					// colon={false}
					labelAlign="left"
					form={form}
					onFinish={handleSubmit}
					initialValues={{
						// type: 'Contact',
						// category: 'Individual',
						// gstTreatment,
						// placeOfSupply: SCHEDULER_TYPE[0],
					}}
					{...layer1FormCol}>
					<Form.Item
						label="Customer Name"
						name="customerId"
						initialValue={editScheduler?.displayName}
						rules={[
							{
								required: true,
								message: 'This Field is Required!',
							},
						]}>
						<Select
							showSearch
							optionFilterProp="children"
							filterOption={(input, option) =>
								option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
								option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
							}
							placeholder="Select Customer">
							{customers?.map((customer) => (
								<Select.Option value={customer._id}>{customer?.displayName}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label="Date"
						name="date"
						// wrapperCol={{
						// 	span: 12,
						// }}
						// labelCol={{
						// 	span: 8,
						// }}
						initialValue={moment()}
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} placeholder="enter invoice date" />
					</Form.Item>
					<Form.Item
						label="Schedule Type"
						name="scheduleType"
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<Select placeholder="Schedule Type">
							{SCHEDULER_TYPE.map((type) => (
								<Select.Option key={type} value={type}>
									{type}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label="Reference Number"
						name="refNumber"
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<Input placeholder="Reference Number" />
					</Form.Item>
					<Form.Item
						label="Amount"
						name="amount"
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<InputNumber style={{ width: '100%' }} placeholder="Amount"/>
					</Form.Item>
					<Form.Item
						label="Due Date"
						name="dueDate"
						// wrapperCol={{
						// 	span: 12,
						// }}
						// labelCol={{
						// 	span: 8,
						// }}
						initialValue={moment()}
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<DatePicker format={DATE_FORMAT.DD_MM_YYYY} style={{ width: '100%' }} placeholder="enter due date" />
					</Form.Item>
					<Form.Item label="Remarks" name="remarks">
						<Input.TextArea placeholder="enter remarks"/>
					</Form.Item>
					<Form.Item
						wrapperCol={{
							offset: 0,
							span: 24,
						}}>
						<Row className="space-between" style={{ paddingTop: 20, width: '100%', margin: 0 }}>
							<Button danger style={{ width: '49%' }} onClick={() => setSchedulerAddModal(false)}>
								Cancel
							</Button>
							<Button loading={loading} style={{ width: '49%' }} type="primary" htmlType="submit">
								{editScheduler ? 'Update' : 'Save'}
							</Button>
						</Row>
					</Form.Item>
				</Form>
			</Row>
		</Drawer>
	);
};

export default AddScheduler;
