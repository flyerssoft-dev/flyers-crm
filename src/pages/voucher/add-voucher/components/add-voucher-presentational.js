import React, { useCallback } from 'react';
import { Button, Form, Input, Select, Modal, Drawer, Row, Col, InputNumber, Radio } from 'antd';
import moment from 'moment';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from 'constants/app-constants';
import DatePicker from 'components/date-picker';
import AddDrawer from 'components/drawer-component';
import CategoryModal from 'components/category-modal';
import SubCategoryModal from 'components/sub-category-modal';

const { confirm } = Modal;

const formItemLayout = {
	labelCol: { span: 10 },
	wrapperCol: { span: 14 },
};

const AddVoucherPresentational = ({
	state,
	setState,
	form,
	handleSubmit,
	loading,
	handleEdit,
	voucherHeadModal,
	setVoucherHeadModal,
	getVoucherHeads,
	accountBooks,
	users,
	isPersonal,
	projects,
	categoryIdValue,
	projectsLoading,
	accountBooksLoading,
}) => {
	const showConfirm = useCallback(() => {
		confirm({
			title: 'Do you want to close this window?',
			icon: <ExclamationCircleOutlined />,
			content: 'You will be lost all the details you have entered here.',
			onOk() {
				setState((state) => ({
					...state,
					visible: false,
				}));
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}, [setState]);

	const isEditMode = !!state?.selectedRow;

	return (
		<Drawer
			maskClosable={false}
			title={`${isEditMode ? 'Edit' : 'Add New'} Voucher`}
			width={'30%'}
			open={state?.visible}
			destroyOnHidden
			onClose={showConfirm}
			footer={
				<Row>
					<Col
						xl={{
							span: 14,
							offset: 10,
						}}
						md={{
							span: 14,
							offset: 10,
						}}>
						<Row gutter={[10, 10]} style={{ width: '100%' }} justify="end">
							<Col>
								<Button
									onClick={() =>
										setState({
											...state,
											visible: false,
										})
									}>
									Cancel
								</Button>
							</Col>
							<Col>
								<Button loading={loading} type="primary" htmlType="submit" onClick={() => form.submit()}>
									{isEditMode ? 'Update' : 'Submit'}
								</Button>
							</Col>
						</Row>
					</Col>
				</Row>
			}>
			<Row justify="center">
				<Col xl={24} md={24}>
					<Form
						form={form}
						labelAlign="left"
						className="form-container required_in_right"
						{...formItemLayout}
						onFinish={(values) => (state?.selectedRow ? handleEdit(values) : handleSubmit(values))}>
						<Row>
							<Col xl={24} md={24}>
								<Form.Item initialValue={moment()} label="Voucher Date" name="voucherDate" rules={[{ required: true }]}>
									<DatePicker style={{ width: '100%' }} format={DATE_FORMAT.DD_MM_YYYY} />
								</Form.Item>
							</Col>
							<Col xl={24} md={24}>
								<Form.Item label="Voucher Type" initialValue="Business" rules={[{ required: true }]} name="voucherType">
									<Radio.Group buttonStyle="solid">
										<Radio.Button
											value="Business"
											// style={!isPersonal ? { backgroundColor: '#6d28d2', color: '#fff', borderColor: '#6d28d2' } : {}}
										>
											Business
										</Radio.Button>
										<Radio.Button value="Personal">Personal</Radio.Button>
									</Radio.Group>
								</Form.Item>
							</Col>
							{isPersonal ? (
								<Col xl={24} md={24}>
									<Form.Item label="User" rules={[{ required: true }]} name="personalUserId">
										<Select
											placeholder="Select User"
											showSearch
											allowClear
											filterOption={(input, option) => {
												return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
											}}>
											{users?.map((user) => (
												<Select.Option key={user?._id} value={user?.userId}>
													{user?.firstName || '-'} {user?.lastName || '-'}
												</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							) : (
								<Col xl={24} md={24}>
									<Form.Item label="Project" rules={[{ required: false }]} name="projectId">
										<Select
											placeholder="Select Project"
											loading={projectsLoading}
											showSearch
											allowClear
											filterOption={(input, option) => {
												return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
											}}>
											{projects?.map((project) => (
												<Select.Option value={project?._id}>{project?.projectName || '-'}</Select.Option>
											))}
										</Select>
									</Form.Item>
								</Col>
							)}
							<Col xl={24} md={24}>
								<Form.Item label="Category" rules={[{ required: true }]} name="categoryId">
									<CategoryModal handleCategoryChange={()=> form.setFieldsValue({ subcategoryId: undefined })}/>
								</Form.Item>
								<Form.Item label="Sub Category" rules={[{ required: true }]} name="subcategoryId">
									<SubCategoryModal categoryIdValue={categoryIdValue} />
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xl={24} md={24}>
								<Form.Item label="Transaction Type" initialValue={'Credit'} rules={[{ required: true }]} name="transactionType">
									<Radio.Group
										options={[
											{ label: 'Credit', value: 'Credit' },
											{ label: 'Debit', value: 'Debit' },
										]}
										optionType="button"
										buttonStyle="solid"
									/>
								</Form.Item>
							</Col>
							<Col xl={24} md={24}>
								<Form.Item label="Amount" name="amount" rules={[{ required: true }]}>
									<InputNumber style={{ width: '100%' }} placeholder="Enter Amount" />
								</Form.Item>
							</Col>
							<Col xl={24} md={24}>
								<Form.Item label="Account Book" rules={[{ required: true }]} name="accbookId">
									<Select
										showSearch
										allowClear
										loading={accountBooksLoading}
										disabled={accountBooksLoading}
										placeholder="Select Account Book"
										filterOption={(input, option) => {
											return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
										}}>
										{accountBooks.map((accountBook) => (
											<Select.Option value={accountBook?._id}>{accountBook?.accbookName}</Select.Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row>
							<Col xl={24} md={24}>
								<Form.Item label="Remarks" name="remarks" rules={[{ required: false }]}>
									<Input.TextArea placeholder="Enter Remarks" />
								</Form.Item>
							</Col>
						</Row>
					</Form>
				</Col>
			</Row>
			<AddDrawer {...{ voucherHeadModal, setVoucherHeadModal, getVoucherHeads }} />
		</Drawer>
	);
};

export default AddVoucherPresentational;
