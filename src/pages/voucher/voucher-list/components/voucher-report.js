import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Button, Col, Form, Pagination, Row, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { sendGetRequest } from 'redux/sagas/utils';
import { ACTIONS, API_STATUS, DATE_FORMAT, VOUCHER_TYPE } from 'constants/app-constants';
import TableComponent from 'components/table-component';
import { SERVER_IP } from 'assets/Config';
import { formatToIndianRupees, objToQs } from 'helpers';
import DatePicker from 'components/date-picker';
import ExcelDownload from 'components/excel-download';
import { getApi } from 'redux/sagas/getApiDataSaga';
import CategoryModal from 'components/category-modal';
import SubCategoryModal from 'components/sub-category-modal';
import HighlightComponent from 'components/HighlightComponent';
import moment from 'moment';

const layer1FormCol = {
	labelCol: { span: 12 },
	wrapperCol: { span: 12 },
};

const PAGE_SIZE_OPTIONS = [20, 50, 100];

const getBackgroundColor = (type) => {
	if (type === 'Debit') return 'rgb(255 229 229)';
	if (type === 'Credit') return '#DEFFDB';
	return '';
};

const VoucherReport = () => {
	const [form] = Form.useForm();
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const [details, setDetails] = useState({ data: [], loading: false });

	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const categoryIdValue = Form.useWatch('categoryId', form);

	const { accountBooks = [], users = [], subCategories = [], apiStatus, selectedOrganization } = globalRedux;

	const orgId = selectedOrganization?.id;

	const fetchData = useCallback(
		(key, endpoint) => {
			if (orgId) {
				const url = `${SERVER_IP}${endpoint}?orgId=${orgId}`;
				dispatch(getApi(key, url));
			}
		},
		[dispatch, orgId]
	);

	useEffect(() => {
		fetchData('GET_PROJECTS', 'project');
		fetchData('GET_ACCOUNT_BOOKS', 'accbook');
		fetchData('GET_USERS', 'user');
		fetchData('GET_CATEGORIES', 'category');
		fetchData('GET_SUB_CATEGORIES', 'subcategory');
		getVoucherReports();
	}, [fetchData]);

	const getVoucherReports = async () => {
		setDetails((prev) => ({ ...prev, loading: true }));

		const params = objToQs({
			voucherType: form.getFieldValue('voucherType'),
			personalUserId: form.getFieldValue('personalUserId'),
			projectId: form.getFieldValue('projectId'),
			fromDate: form.getFieldValue('fromDate')?.format('YYYY-MM-DD'),
			toDate: form.getFieldValue('toDate')?.format('YYYY-MM-DD'),
			categoryId: form.getFieldValue('categoryId'),
			subcategoryId: form.getFieldValue('subcategoryId'),
			accbookId: form.getFieldValue('accbookId'),
		});

		const res = await sendGetRequest(ACTIONS.GET_VOUCHER_REPORTS, `${SERVER_IP}voucher?orgId=${orgId}${params ? `&${params}` : ''}`);

		const data = res?.data?.data || [];
		setDetails({ data, loading: false });
	};

	const checkType = (value) => {
		let background = '';
		if (value) {
			if (value === 'Debit') {
				background = 'rgb(255 229 229)';
			}
			if (value === 'Credit') {
				background = '#DEFFDB';
			}
		}

		return background;
	};

	const columns = useMemo(
		() => [
			{
				title: '#',
				dataIndex: 'voucherNumber',
				key: 'voucherNumber',
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: (
							<HighlightComponent
								highlightClassName="highlightClass"
								// searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value?.toString()}
							/>
						),
					};
				},
			},
			{
				title: 'Date',
				dataIndex: 'voucherDate',
				key: 'voucherDate',
				sorter: (a, b) => new Date(a.voucherDate) - new Date(b.voucherDate),
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: (
							<HighlightComponent
								highlightClassName="highlightClass"
								// searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value ? moment(value).format(DATE_FORMAT.DD_MM_YYYY) : ''}
							/>
						),
					};
				},
			},
			{
				title: 'Category',
				dataIndex: 'categoryId',
				key: 'categoryId',
				sorter: (a, b) => a.categoryId?.categoryName.localeCompare(b.categoryId?.categoryName),
				fixed: 'left',
				width: 150,
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: (
							<HighlightComponent
								highlightClassName="highlightClass"
								// searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value?.categoryName}
							/>
						),
					};
				},
			},
			{
				title: 'Sub Category',
				dataIndex: 'subcategoryId',
				key: 'subcategoryId',
				sorter: (a, b) => a.subcategoryId?.subcategoryName.localeCompare(b.subcategoryId?.subcategoryName),
				fixed: 'left',
				width: 150,
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: (
							<HighlightComponent
								highlightClassName="highlightClass"
								// searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value?.subcategoryName}
							/>
						),
					};
				},
			},
			{
				title: 'Trans. Type',
				dataIndex: 'transactionType',
				key: 'transactionType',
				sorter: (a, b) => a?.transactionType?.localeCompare(b?.transactionType),
				fixed: 'left',
				width: 150,
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(value),
							},
						},
						children: <HighlightComponent highlightClassName="highlightClass" autoEscape={true} textToHighlight={value} />,
					};
				},
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				key: 'amount',
				sorter: (a, b) => a?.amount - b?.amount,
				align: 'right',
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: (
							<HighlightComponent
								highlightClassName="highlightClass"
								// searchWords={[searchKey]}
								autoEscape={true}
								textToHighlight={value?.toString()}
							/>
						),
					};
				},
			},
			{
				title: 'Remarks',
				dataIndex: 'remarks',
				key: 'remarks',
				render: (value, record) => {
					return {
						props: {
							style: {
								background: checkType(record?.transactionType),
							},
						},
						children: <HighlightComponent highlightClassName="highlightClass" autoEscape={true} textToHighlight={value} />,
					};
				},
			},
		],
		[details.data]
	);

	const exportData = useMemo(
		() => ({
			headers: [
				'Voucher #',
				'Transaction Type',
				'Amount',
				'Voucher Type',
				'Voucher Date',
				'Project ID',
				'Category Name',
				'Subcategory Name',
				'Account Book',
				'Remarks',
				'Created By',
				'Created At',
				'Updated At',
			],
			data: details.data.map((item) => ({
				'Voucher #': item.voucherNumber,
				'Transaction Type': item.transactionType,
				Amount: parseFloat(item.amount || 0).toFixed(2),
				'Voucher Type': item.voucherType,
				'Voucher Date': new Date(item.voucherDate).toLocaleString(),
				'Project ID': item.projectId?._id || '',
				'Category Name': item.categoryId?.categoryName || '',
				'Subcategory Name': item.subcategoryId?.subcategoryName || '',
				'Account Book': item.accbookId?.accbookName || '',
				Remarks: item.remarks || '',
				'Created By': `${item.createdBy?.firstName || ''} ${item.createdBy?.lastName || ''}`.trim(),
				'Created At': new Date(item.createdAt).toLocaleString(),
				'Updated At': new Date(item.updatedAt).toLocaleString(),
			})),
		}),
		[details.data]
	);

	return (
		<Row gutter={16}>
			<Col span={24}>
				<TableComponent
					loading={details.loading}
					className="custom-table"
					columns={columns}
					rowKey={(record) => record._id}
					dataSource={details.data}
					pagination={{
						pageSize,
						current: currentPage,
						position: ['none', 'none'],
					}}
					title={() => (
						<Row>
							<Col span={16}>
								<Form
									form={form}
									onFinish={getVoucherReports}
									requiredMark={false}
									labelAlign="left"
									layout="vertical"
									name="voucher-report">
									<Row gutter={16}>
										<Col span={8}>
											<Form.Item label="Voucher Type" name="voucherType">
												<Select
													showSearch
													allowClear
													placeholder="Select Voucher Type"
													filterOption={(input, option) =>
														(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
													}>
													{VOUCHER_TYPE.map((data) => (
														<Select.Option key={data.value} value={data.value}>
															{data.label}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
											<Form.Item label="Account Book" name="accbookId" rules={[{ required: false }]}>
												<Select showSearch allowClear placeholder="Select Account Book">
													{accountBooks.map((book) => (
														<Select.Option key={book._id} value={book._id}>
															{book.name}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
										</Col>

										<Col span={8}>
											<Form.Item label="From Date" name="fromDate">
												<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
											</Form.Item>
											<Form.Item label="To Date" name="toDate">
												<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
											</Form.Item>
										</Col>

										<Col span={8}>
											<Form.Item label="Category" name="categoryId" rules={[{ required: false }]}>
												<CategoryModal />
											</Form.Item>
											<Form.Item label="Sub Category" name="subcategoryId" rules={[{ required: false }]}>
												<SubCategoryModal categoryIdValue={categoryIdValue} />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={8}>
											<Form.Item label="User" name="personalUserId" rules={[{ required: false }]}>
												<Select
													placeholder="Select User"
													showSearch
													allowClear
													filterOption={(input, option) =>
														(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
													}>
													{users?.map((user) => (
														<Select.Option key={user?._id} value={user?.userId}>
															{user?.firstName || '-'} {user?.lastName || '-'}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
										</Col>

										<Col span={8}>
											<Form.Item label="Project" name="projectId">
												<Select
													placeholder="Select Project"
													showSearch
													allowClear
													filterOption={(input, option) =>
														(option?.children ?? '').toLowerCase().includes(input.toLowerCase())
													}>
													{projects?.map((project) => (
														<Select.Option key={project?._id} value={project?._id}>
															{project?.projectName || '-'}
														</Select.Option>
													))}
												</Select>
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												wrapperCol={{
													offset: 0,
													span: 24,
												}}>
												<Row className="space-between">
													<Button type="primary" style={{ marginRight: 5, width: '49%' }} htmlType="submit">
														Submit
													</Button>
													<Button
														onClick={() => {
															setDetails({ data: [], loading: false });
															form.resetFields();
														}}
														style={{ width: '49%' }}
														danger>
														Reset
													</Button>
													<ExcelDownload
														style={{
															marginTop: 10,
															width: '49%',
														}}
														{...{ ...exportData }}
													/>
												</Row>
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</Col>
						</Row>
					)}
				/>
			</Col>
		</Row>
	);
};

export default VoucherReport;
