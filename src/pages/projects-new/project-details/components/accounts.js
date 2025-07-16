import React, { useEffect } from 'react';
import { Col, Form, Row, Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { API_STATUS, DATE_FORMAT } from 'constants/app-constants';
import moment from 'moment';

const Accounts = () => {
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
		customerId: { displayName: customerName = '' } = {},
	} = projectRedux?.projectDetails || {};

	useEffect(() => {
		form.setFieldsValue({
			status,
			title,
			customerName,
			startDate: moment(startDate).format(DATE_FORMAT.DD_MM_YYYY),
			dueDate: moment(dueDate).format(DATE_FORMAT.DD_MM_YYYY),
			description,
		});
	}, [status, ticketNumber, title, description, startDate, customerName, dueDate, form]);

	const loading = globalRedux.apiStatus.GET_TICKETS_DETAILS === API_STATUS.PENDING;

	return (
		<Row className="ticket_details_overview">
			<Col span={24}>
				{loading ? (
					<Col>
						<Skeleton active />
					</Col>
				) : (
					<></>
				)}
			</Col>
		</Row>
	);
};

export default Accounts;
