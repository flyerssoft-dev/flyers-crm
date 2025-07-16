import React, { useEffect } from 'react';
import { Row, Col, Input, Button, Form, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { API_STATUS } from 'constants/app-constants';
import { SERVER_IP } from 'assets/Config';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const AddVehicle = ({ vehicleAddModal, width = '40%', editVehicle, setVehicleAddModal, refreshList, handleClose }) => {
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const dispatch = useDispatch();

	useEffect(() => {
		if (editVehicle) {
			form.setFieldsValue({
				regNumber: editVehicle?.regNumber,
			});
		} else {
			form?.resetFields();
		}
	}, [editVehicle, form]);

	const handleSubmit = (values) => {
		let data = {
			orgId: globalRedux?.selectedOrganization?._id,
			regNumber: values?.regNumber,
		};

		if (!editVehicle) {
			dispatch(postApi(data, 'ADD_VEHICLE'));
		} else {
			let url = `${SERVER_IP}vehicle/${editVehicle._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
			dispatch(putApi(data, 'EDIT_VEHICLE', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_VEHICLE === 'SUCCESS' || globalRedux.apiStatus.EDIT_VEHICLE === 'SUCCESS') {
			dispatch(resetApiStatus(editVehicle ? 'EDIT_VEHICLE' : 'ADD_VEHICLE'));
			refreshList?.();
			handleClose?.();
			form?.resetFields();
		}
	}, [globalRedux.apiStatus, editVehicle, setVehicleAddModal, dispatch, refreshList, handleClose, form]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_VEHICLE === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_VEHICLE === API_STATUS.PENDING;

	return (
		<Drawer placement="right" title={`${editVehicle ? 'Edit' : 'New'} Vehicle`} width={width || '40%'} open={vehicleAddModal} closable onClose={() => setVehicleAddModal(false)} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Row style={{ marginTop: 0 }}>
						<Form
							name="add-vehicle"
							className="required_in_right"
							style={{ width: '100%' }}
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={handleSubmit}
							initialValues={
								{
									// type: 'Contact',
								}
							}
							{...layer1FormCol}>
							<Form.Item
								label="Reg. Number"
								name="regNumber"
								rules={[
									{
										required: true,
										message: 'This Field is required!',
									},
								]}>
								<Input placeholder="Enter Reg. Number" autoFocus />
							</Form.Item>
							<Form.Item
								wrapperCol={{
									offset: 0,
									span: 24,
								}}>
								<Row className="space-between" gutter={[10, 10]} style={{ paddingTop: 20, width: '100%', margin: 0 }}>
									<Col span={12}>
										<Button style={{ width: '100%' }} danger onClick={() => setVehicleAddModal(false)}>
											Cancel
										</Button>
									</Col>
									<Col span={12}>
										<Button style={{ width: '100%' }} loading={loading} type="primary" htmlType="submit">
											{editVehicle ? 'Update' : 'Save'}
										</Button>
									</Col>
								</Row>
							</Form.Item>
						</Form>
					</Row>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddVehicle;
