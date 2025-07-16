import React, { useEffect } from 'react';
import { Col, Form, Input, Row, Skeleton, Tag } from 'antd';
import { useSelector } from 'react-redux';
import { API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import moment from 'moment';

const layer1FormCol = {
	labelCol: {
		span: 8,
	},
	wrapperCol: {
		span: 16,
	},
};

const COLORS = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

const Overview = () => {
	const projectRedux = useSelector((state) => state.projectRedux);
	const globalRedux = useSelector((state) => state.globalRedux);
	const [form] = Form.useForm();

	const {
		status,
		startDate,
		dueDate,
		ticketNumber,
		title,
		description,
		priority,
		createdBy,
		customerId: { displayName: customerName = '', email = '' } = {},
		assignedTo = {},
		referredBy: { displayName: referredByName = '' } = {},
		categoryId: { categoryName = '' } = {},
	} = projectRedux?.projectDetails || {};

	useEffect(() => {
		form.setFieldsValue({
			status,
			title,
			customerName,
			referredBy: referredByName,
			assignedTo: `${assignedTo?.firstName || '-'} ${assignedTo?.lastName || '-'}`,
			categoryName,
			startDate: moment(startDate).format(DATE_FORMAT.DD_MM_YYYY),
			dueDate: moment(dueDate).format(DATE_FORMAT.DD_MM_YYYY),
			description,
		});
	}, [status, ticketNumber, title, description, startDate, customerName, dueDate, form, assignedTo, categoryName, referredByName]);

	const loading = globalRedux.apiStatus.GET_PROJECTS_DETAILS === API_STATUS.PENDING;

	return (
		<Row className="ticket_details_overview">
			<Col span={24}>
				{loading ? (
					<Col>
						<Skeleton active />
					</Col>
				) : (
					<Row>
						<Col span={12}>
							<Form
								name="overview"
								requiredMark={false}
								// colon={false}
								labelAlign="left"
								form={form}
								initialValues={{
									status: status || '',
									customerName: customerName || '',
									email: email || '',
									title: title || '',
									description: description || '',
									priority: priority || '',
									ticketNumber: ticketNumber || '',
									createdBy: `${createdBy?.firstName} ${createdBy?.lastName}` || '',
								}}
								{...layer1FormCol}>
								<Form.Item
									label="Project Title"
									name="title"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Project Title" disabled />
								</Form.Item>
								<Form.Item
									label="Start Date"
									name="startDate"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Start Date" disabled />
								</Form.Item>
								<Form.Item
									label="Due Date"
									name="dueDate"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Due Date" disabled />
								</Form.Item>
								<Form.Item
									label="Description"
									name="description"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Description" disabled />
								</Form.Item>
							</Form>
							{projectRedux?.projectDetails?.tags?.map((tag, index) => (
								<Tag color={COLORS[index]} key={tag?._id}>
									{tag?.tagId?.tagName}
								</Tag>
							))}
						</Col>
						<Col span={12}>
							<Form
								name="overview"
								requiredMark={false}
								labelAlign="left"
								form={form}
								initialValues={{
									status: status || '',
									customerName: customerName || '',
									email: email || '',
									title: title || '',
									description: description || '',
									priority: priority || '',
									ticketNumber: ticketNumber || '',
									createdBy: `${createdBy?.firstName} ${createdBy?.lastName}` || '',
								}}
								{...layer1FormCol}>
								<Form.Item
									label="Customer Name"
									name="customerName"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Customer Name" disabled />
								</Form.Item>
								<Form.Item
									label="Assigned To"
									name="assignedTo"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Referred By" disabled />
								</Form.Item>
								<Form.Item
									label="Referred By"
									name="referredBy"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Referred By" disabled />
								</Form.Item>
								<Form.Item
									label="Category"
									name="categoryName"
									rules={[
										{
											required: true,
											message: 'This Field is Required!',
										},
									]}>
									<Input placeholder="Category" disabled />
								</Form.Item>
							</Form>
						</Col>
					</Row>
				)}
			</Col>
		</Row>
	);
};

export default Overview;
