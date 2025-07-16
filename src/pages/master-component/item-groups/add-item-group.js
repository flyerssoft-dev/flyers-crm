import React, { useEffect } from 'react';
import { Input, Button, Form, Row, Col, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { putApi } from 'redux/sagas/putApiSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';

const { TextArea } = Input;

const AddItemGroup = ({ itemGroupAddModal, setItemGroupAddModal, editItemGroups, handleClose, refreshList, width = '40%' }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	useEffect(() => {
		if (editItemGroups) {
			form.setFieldsValue({
				itemGroupName: editItemGroups?.itemGroupName,
				remarks: editItemGroups?.remarks,
			});
		} else {
			form.resetFields();
		}
	}, [editItemGroups, form]);

	const handleSubmit = (values) => {
		const payload = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};

		if (!editItemGroups) {
			dispatch(postApi(payload, 'ADD_ITEM_GROUP'));
		} else {
			const url = `${SERVER_IP}itemgroup/${editItemGroups._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(payload, 'EDIT_ITEM_GROUP', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ITEM_GROUP === 'SUCCESS' || globalRedux.apiStatus.EDIT_ITEM_GROUP === 'SUCCESS') {
			dispatch(resetApiStatus(editItemGroups ? 'EDIT_ITEM_GROUP' : 'ADD_ITEM_GROUP'));
			refreshList?.();
			handleClose?.();
			setItemGroupAddModal(false);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editItemGroups, dispatch, refreshList, handleClose, setItemGroupAddModal, form]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading = globalRedux.apiStatus.ADD_ITEM_GROUP === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ITEM_GROUP === API_STATUS.PENDING;

	return (
		<Drawer placement="right" title={`${editItemGroups ? 'Edit' : 'New'} Item Group`} width={width} open={itemGroupAddModal} closable onClose={() => setItemGroupAddModal(false)} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Form form={form} name="item-group-form" onFinish={handleSubmit} colon={false} requiredMark={false} labelAlign="left" style={{ width: '100%' }} {...layer1FormCol}>
						<Form.Item label="Item Group Name" name="itemGroupName" rules={[{ required: true, message: 'This field is required!' }]}>
							<Input placeholder="Enter item group name" />
						</Form.Item>

						<Form.Item label="Remarks" name="remarks">
							<TextArea placeholder="Enter remarks" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row gutter={10} style={{ paddingTop: 20 }}>
								<Col span={12}>
									<Button danger onClick={() => setItemGroupAddModal(false)} style={{ width: '100%' }}>
										Cancel
									</Button>
								</Col>
								<Col span={12}>
									<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
										{editItemGroups?._id ? 'Update' : 'Create'}
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

export default AddItemGroup;
