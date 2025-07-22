import React, { useEffect } from 'react';
import { Input, Button, Form, Row, Col, Select, Drawer } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';

const { TextArea } = Input;

const AddSubCategory = ({ subCategoryAddModal, setSubCategoryAddModal, editSubCategory, selectedCategory, handleClose, refreshList, width = '40%' }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const categories = globalRedux.categories;

	useEffect(() => {
		if (editSubCategory) {
			form.setFieldsValue({
				categoryId: editSubCategory?.category?._id,
				subcategoryName: editSubCategory?.subcategoryName,
				remarks: editSubCategory?.remarks,
			});
		} else {
			form.setFieldsValue({
				categoryId: selectedCategory || undefined,
			});
		}
	}, [editSubCategory, selectedCategory, form]);

	const handleSubmit = (values) => {
		const data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};

		if (!editSubCategory) {
			dispatch(postApi(data, 'ADD_SUB_CATEGORY'));
		} else {
			const url = `${SERVER_IP}subcategory/${editSubCategory._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(data, 'EDIT_SUB_CATEGORY', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_SUB_CATEGORY === 'SUCCESS' || globalRedux.apiStatus.EDIT_SUB_CATEGORY === 'SUCCESS') {
			dispatch(resetApiStatus(editSubCategory ? 'EDIT_SUB_CATEGORY' : 'ADD_SUB_CATEGORY'));
			refreshList?.();
			handleClose?.();
			setSubCategoryAddModal(false);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, editSubCategory, dispatch, refreshList, handleClose, setSubCategoryAddModal, form]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading = globalRedux.apiStatus.ADD_SUB_CATEGORY === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_SUB_CATEGORY === API_STATUS.PENDING;

	return (
		<Drawer placement="right" title={`${editSubCategory ? 'Edit' : 'New'} Sub Category`} width={width} open={subCategoryAddModal} closable onClose={() => setSubCategoryAddModal(false)} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Form form={form} name="sub-category-form" onFinish={handleSubmit} colon={false} requiredMark={false} labelAlign="left" style={{ width: '100%' }} {...layer1FormCol}>
						<Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'This Field is Required!' }]}>
							<Select placeholder="Select Category" showSearch optionFilterProp="children" filterOption={(input, option) => option.children?.toLowerCase().includes(input.toLowerCase())}>
								{categories?.map((category) => (
									<Select.Option key={category?._id} value={category?._id}>
										{category?.categoryName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>

						<Form.Item label="Sub Category Name" name="subcategoryName" rules={[{ required: true, message: 'This Field is Required!' }]}>
							<Input placeholder="Sub Category Name" />
						</Form.Item>

						<Form.Item label="Remarks" name="remarks">
							<TextArea placeholder="Remarks" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row gutter={10} style={{ paddingTop: 20 }}>
								<Col span={12}>
									<Button danger onClick={() => setSubCategoryAddModal(false)} style={{ width: '100%' }}>
										Cancel
									</Button>
								</Col>
								<Col span={12}>
									<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
										{editSubCategory?._id ? 'Update' : 'Create'}
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

export default AddSubCategory;
