import React, { useEffect } from 'react';
import moment from 'moment';
import { Input, Button, Form, Row, Col, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { putApi } from 'redux/sagas/putApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import DatePicker from 'components/date-picker';

const { TextArea } = Input;

const AddAccountBook = ({ accBookAddModal, setAccBookAddModal, editAccountBooks, refreshList, handleClose, width = '40%' }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	useEffect(() => {
		if (editAccountBooks) {
			form.setFieldsValue({
				accbookName: editAccountBooks?.accbookName,
				openingBalance: editAccountBooks?.openingBalance || 0,
				openingDate: editAccountBooks?.openingDate ? moment(editAccountBooks?.openingDate) : null,
				remarks: editAccountBooks?.remarks,
			});
		} else {
			form.resetFields();
		}
	}, [editAccountBooks, form]);

	const handleSubmit = (values) => {
		const payload = {
			...values,
			openingDate: values?.openingDate?.format('YYYY-MM-DD'),
			orgId: globalRedux?.selectedOrganization?.id,
		};

		if (!editAccountBooks) {
			dispatch(postApi(payload, 'ADD_ACCOUNT_BOOK'));
		} else {
			const url = `${SERVER_IP}accBook/${editAccountBooks._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(payload, 'EDIT_ACC_BOOK', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ACCOUNT_BOOK === 'SUCCESS' || globalRedux.apiStatus.EDIT_ACC_BOOK === 'SUCCESS') {
			dispatch(resetApiStatus(editAccountBooks ? 'EDIT_ACC_BOOK' : 'ADD_ACCOUNT_BOOK'));
			refreshList?.();
			handleClose?.();
			setAccBookAddModal(false);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, dispatch, editAccountBooks, form, handleClose, refreshList, setAccBookAddModal]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading =
		globalRedux.apiStatus.ADD_ACCOUNT_BOOK === API_STATUS.PENDING ||
		globalRedux.apiStatus.EDIT_ACC_BOOK === API_STATUS.PENDING;

	return (
		<Drawer
			placement="right"
			title={`${editAccountBooks ? 'Edit' : 'New'} Account Book`}
			width={width}
			open={accBookAddModal}
			closable
			onClose={() => setAccBookAddModal(false)}
			destroyOnHidden
		>
			<Row>
				<Col span={24}>
					<Form
						name="account-book-form"
						form={form}
						onFinish={handleSubmit}
						colon={false}
						requiredMark={false}
						labelAlign="left"
						style={{ width: '100%' }}
						{...layer1FormCol}
					>
						<Form.Item
							label="Account Book Name"
							name="accbookName"
							rules={[{ required: true, message: 'This field is required!' }]}
						>
							<Input placeholder="Enter account book name" />
						</Form.Item>

						<Form.Item label="Opening Balance" name="openingBalance">
							<Input type="number" placeholder="Enter opening balance" />
						</Form.Item>

						<Form.Item
							label="Opening Date"
							name="openingDate"
							rules={[{ required: true, message: 'This field is required!' }]}
						>
							<DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
						</Form.Item>

						<Form.Item label="Remarks" name="remarks">
							<TextArea placeholder="Remarks" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row gutter={10} style={{ paddingTop: 20 }}>
								<Col span={12}>
									<Button danger onClick={() => setAccBookAddModal(false)} style={{ width: '100%' }}>
										Cancel
									</Button>
								</Col>
								<Col span={12}>
									<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
										{editAccountBooks ? 'Update' : 'Save'}
									</Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddAccountBook;
