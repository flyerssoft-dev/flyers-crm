import React, { useCallback, useEffect } from 'react';
import { Input, Button, Divider, Form, Row, Col } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { getApi } from 'redux/sagas/getApiDataSaga';

const AddSubCategory = ({ handleClose, editSubCategory, setSubCategoryAddModal, selectedCategory }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	const addSubCategories = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
			categoryId: selectedCategory
		};
		dispatch(postApi(data, 'ADD_SUB_CATEGORY'));
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			categoryId: selectedCategory,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		let url = `${SERVER_IP}subcategory/${editSubCategory._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(putApi(data, 'EDIT_SUB_CATEGORY', url));
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_SUB_CATEGORY === 'SUCCESS' || globalRedux.apiStatus.EDIT_SUB_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus(editSubCategory ? 'EDIT_SUB_CATEGORY' : 'ADD_SUB_CATEGORY'));
			setSubCategoryAddModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editSubCategory, setSubCategoryAddModal, handleClose, dispatch]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_SUB_CATEGORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SUB_CATEGORY === API_STATUS.PENDING;

	return (
		<Row>
			<Col span={24}>
				<Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
					<Col>
						<h6 style={{ marginBottom: '0px' }}>{editSubCategory ? 'Edit' : 'New'} Sub Category</h6>
					</Col>
				</Row>
				<Divider />
				<Row style={{ paddingTop: 20 }}>
					<Col span={24}>
						<Form
							name="add-category"
							className="required_in_right"
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={!editSubCategory ? addSubCategories : handleEdit}
							{...layer1FormCol}>
							<Form.Item
								label="Sub Category Name"
								name="subCategoryName"
								initialValue={editSubCategory?.subCategoryName}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input placeholder="Sub Category Name" />
							</Form.Item>
							<Form.Item
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}
								label="Remarks"
								name="remarks"
								initialValue={editSubCategory?.remarks}>
								<Input.TextArea placeholder="Remarks" />
							</Form.Item>
							<Form.Item
								wrapperCol={{
									span: 24,
								}}>
								<Row justify="space-between">
									<Button onClick={() => setSubCategoryAddModal(false)} style={{ width: '49%', marginRight: 5 }} danger>
										Cancel
									</Button>
									<Button loading={loading} type="primary" style={{ width: '49%' }} htmlType="submit">
										Create
									</Button>
								</Row>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default AddSubCategory;
