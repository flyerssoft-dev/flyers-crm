import React, { useEffect } from 'react';
import { Input, Button, Divider, Form, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { postApi } from '../../redux/sagas/postApiDataSaga';
import { resetApiStatus } from '../../redux/reducers/globals/globalActions';

const AddAsset = ({ handleClose, editAsset, setAssetsAddModal }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	const addAsset = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?._id,
		};
		dispatch(postApi(data, 'ADD_ASSETS'));
	};

	const handleEdit = (values) => {
		let data = {
			...values,

			orgId: globalRedux?.selectedOrganization?._id,
		};
		let url = `${SERVER_IP}asset/${editAsset._id}?orgId=${globalRedux?.selectedOrganization?._id}`;
		dispatch(putApi(data, 'EDIT_ASSET', url));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_ASSETS === 'SUCCESS' || globalRedux.apiStatus.EDIT_ASSET === 'SUCCESS') {
			dispatch(resetApiStatus(editAsset ? 'EDIT_ASSET' : 'ADD_ASSETS'));
			setAssetsAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editAsset, handleClose, setAssetsAddModal, dispatch]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_ASSETS === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_ASSET === API_STATUS.PENDING;

	return (
		<Row>
			<Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
				<Col>
					<h6 style={{ marginBottom: '0px' }}>New Asset</h6>
				</Col>
			</Row>
			<Divider />
			<Row className="mt-3 m-2 pt-2">
				<Form
					name="add-asset"
					style={{}}
					requiredMark={false}
					colon={false}
					labelAlign="left"
					form={form}
					onFinish={!editAsset ? addAsset : handleEdit}
					{...layer1FormCol}>
					<Form.Item
						label="Asset Name"
						name="assetName"
						initialValue={editAsset?.assetName}
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<Input defaultValue={editAsset?.assetName} />
					</Form.Item>
					<Form.Item
						label="Opening balance"
						name="openingBalance"
						initialValue={editAsset?.openingBalance}
						rules={[
							{
								required: true,
								message: 'This Field is required!',
							},
						]}>
						<Input defaultValue={editAsset?.openingBalance} />
					</Form.Item>
					<Form.Item
						wrapperCol={{
							offset: 0,
							span: 24,
						}}>
						<Row className="space-between" style={{ paddingTop: 20 }}>
							<Button loading={loading} style={{ marginRight: '10px', width: '49%' }} type="primary" htmlType="submit">
								Save
							</Button>
							<Button danger style={{ width: '49%' }} onClick={() => setAssetsAddModal(false)}>
								Cancel
							</Button>
						</Row>
					</Form.Item>
				</Form>
			</Row>
		</Row>
	);
};

export default AddAsset;
