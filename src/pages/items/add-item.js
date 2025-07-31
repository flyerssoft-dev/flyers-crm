import React, { useEffect, useCallback } from 'react';
import { Input, Button, Form, Select, Drawer, Row, Col, Radio, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { putApi } from 'redux/sagas/putApiSaga';
import { ITEM_TYPES } from 'constants/app-constants';
import UnitModal from 'components/unit-modal';
import ItemGroupModal from 'components/item-group-modal';

const AddItem = ({ selectedItem, showAddItemModal, showEditItemModal, setShowAddItemModal, setShowEditItemModal, setSelectedItem }) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const taxes = useSelector((state) => state?.globalRedux?.taxes || []);
	const [formInstance] = Form.useForm();
	const inventoryValue = Form.useWatch('inventory', formInstance);
	const dispatch = useDispatch();

	const getUnits = useCallback(() => {
		let url = `${SERVER_IP}unit?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_UNITS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	const getItemGroups = useCallback(() => {
		let url = `${SERVER_IP}itemgroup/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_ITEM_GROUPS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		if(showAddItemModal) {
			getUnits();
			getItemGroups();
		}
	}, [getUnits, getItemGroups, showAddItemModal]);

	useEffect(() => {
		if (selectedItem) {
			formInstance.setFieldsValue({
				...selectedItem,
				itemgroupId: selectedItem?.itemgroupId?._id,
				unitId: selectedItem?.unitId?._id,
				taxId: selectedItem?.taxId?._id,
			});
		}
	}, [formInstance, selectedItem]);

	// useEffect(() => {
	// 	if (!inventoryValue) {
	// 		formInstance.setFieldsValue({
	// 			isSerial: false,
	// 		});
	// 	}
	// }, [formInstance, inventoryValue]);

	useEffect(() => {
		let doIt = false;
		if (globalRedux.apiStatus.ADD_ITEM === 'SUCCESS') {
			setShowAddItemModal(false);
			formInstance.resetFields();
			doIt = true;
			dispatch(resetApiStatus('ADD_ITEM'));
		} else if (globalRedux.apiStatus.EDIT_ITEM === 'SUCCESS') {
			setShowEditItemModal(false);
			formInstance.resetFields();
			setSelectedItem(null);
			doIt = true;
			dispatch(resetApiStatus('EDIT_ITEM'));
		}
		if (doIt) {
			let url = `${SERVER_IP}item?orgId=${globalRedux.selectedOrganization._id}`;
			dispatch(getApi('GET_ITEMS', url));
		}
	}, [
		globalRedux.apiStatus,
		dispatch,
		globalRedux.selectedOrganization._id,
		formInstance,
		setSelectedItem,
		setShowAddItemModal,
		setShowEditItemModal,
	]);

	const FormCol = {
		labelCol: {
			span: 8,
		},
		wrapperCol: {
			span: 16,
		},
	};

	const addItem = (values) => {
		console.log('🚀 ~ addItem ~ values:', values);
		let data = {
			...values,
			orgId: globalRedux.selectedOrganization._id,
		};
		dispatch(postApi(data, 'ADD_ITEM'));
	};

	const editItem = (values) => {
		let data = {
			...values,
			orgId: globalRedux.selectedOrganization._id,
		};

		let url = `${SERVER_IP}item/${selectedItem._id}?orgId=${globalRedux.selectedOrganization._id}`;
		dispatch(putApi(data, 'EDIT_ITEM', url));
	};

	const getCategories = useCallback(() => {
		let url = `${SERVER_IP}category/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CATEGORIES', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getCategories();
	}, [getCategories]);

	useEffect(() => {
		if (!showEditItemModal) {
			setSelectedItem?.(null);
		}
	}, [showEditItemModal, setSelectedItem]);

	const isLoading = globalRedux.apiStatus.ADD_ITEM === 'PENDING' || globalRedux.apiStatus.EDIT_ITEM === 'PENDING';
	return (
		<Drawer
			title={selectedItem ? 'Edit Item' : 'Add New Item'}
			placement="right"
			width={'30%'}
			open={showAddItemModal || showEditItemModal}
			destroyOnHidden
			closable={false}
			maskClosable={false}
			okText="Save"
			footer={
				<Row gutter={[10, 0]}>
					<Col span={12}>
						<Button
							style={{ width: '100%' }}
							onClick={() => {
								showAddItemModal && setShowAddItemModal(false);
								showEditItemModal && setShowEditItemModal(false);
								formInstance.resetFields();
							}}
							danger>
							Cancel
						</Button>
					</Col>
					<Col span={12}>
						<Button
							style={{ width: '100%' }}
							loading={isLoading}
							disabled={isLoading}
							type="primary"
							htmlType="submit"
							onClick={formInstance.submit}>
							{selectedItem ? 'Update' : 'Create'}
						</Button>
					</Col>
				</Row>
			}
			onClose={() => setShowAddItemModal(false)}>
			<Form
				colon={false}
				labelAlign="left"
				className="required_in_right"
				form={formInstance}
				// initialValues={{
				// 	taxId: '0',
				// }}
				onFinish={selectedItem ? editItem : addItem}
				{...FormCol}>
				<Row gutter={[10, 0]}>
					<Col span={24}>
						<Form.Item
							// label="Goods/Service"
							className="hideFormLabel"
							name="itemType"
							initialValue={'Goods'}
							rules={[
								{
									required: false,
									message: 'This Field is Required!',
								},
							]}>
							<Radio.Group options={ITEM_TYPES} optionType="button" buttonStyle="solid" />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[10, 0]}>
					<Col span={24}>
						<Form.Item
							label="Item Group"
							name="itemgroupId"
							getValueFromEvent={(data) => data}
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<ItemGroupModal />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Item Name"
							name="itemName"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Item Name" />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[10, 0]}>
					<Col span={24}>
						<Form.Item
							label="Item/Barcode"
							name="itemCode"
							rules={[
								{
									required: false,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Item/Barcode" />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Hsn/Sac Code"
							name="hsnSac"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Hsn/Sac Code" />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[10, 0]}>
					<Col span={24}>
						<Form.Item
							label="Purchase Price"
							name="purchasePrice"
							rules={[
								{
									required: false,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Purchase Price" />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="Selling Price"
							name="sellingPrice"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="Selling Price" />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="MRP"
							name="mrp"
							rules={[
								{
									required: false,
									message: 'This Field is Required!',
								},
							]}>
							<Input placeholder="MRP" />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[10, 0]}>
					<Col span={24}>
						<Form.Item
							label="Unit"
							name="unitId"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<UnitModal />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							label="GST"
							name="taxId"
							rules={[
								{
									required: true,
									message: 'This Field is Required!',
								},
							]}>
							<Select placeholder="Select GST">
								{taxes?.map((tax) => (
									<Select.Option key={tax._id} value={tax._id}>
										{tax.taxName}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Row>
							<Col span={12}>
								<Form.Item
									label="Is Inventory"
									name="inventory"
									valuePropName="checked"
									labelCol={{ span: 12 }}
									wrapperCol={{ span: 12 }}
									rules={[
										{
											required: false,
											message: 'This Field is Required!',
										},
									]}>
									<Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label="Is Serial"
									name="isSerial"
									valuePropName="checked"
									labelCol={{ span: 12 }}
									wrapperCol={{ span: 12 }}
									rules={[
										{
											required: false,
											message: 'This Field is Required!',
										},
									]}>
									<Switch disabled={!inventoryValue} checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
								</Form.Item>
							</Col>
							{/* {inventoryValue && <Col span={12}>
								<Form.Item
									label="Is Serial"
									name="isSerial"
									valuePropName="checked"
									labelCol={{ span: 12 }}
									wrapperCol={{ span: 12 }}
									rules={[
										{
											required: false,
											message: 'This Field is Required!',
										},
									]}>
									<Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
								</Form.Item>
							</Col>} */}
						</Row>
					</Col>
					<Col span={24}></Col>
				</Row>
			</Form>
		</Drawer>
	);
};

export default AddItem;
