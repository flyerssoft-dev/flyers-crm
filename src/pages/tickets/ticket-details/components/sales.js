import React from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
import { API_STATUS } from 'constants/app-constants';
import TableComponent from 'components/table-component';

const Sales = () => {
	const ticketRedux = useSelector((state) => state.ticketRedux);
	const globalRedux = useSelector((state) => state.globalRedux);

	const ticketDetails = ticketRedux?.ticketDetails || {};
	
	const loading = globalRedux.apiStatus.GET_TICKETS_DETAILS === API_STATUS.PENDING;

	const column = [
		{
			title: 'S.No',
			dataIndex: 'serialNumber',
			key: 'serialNumber',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'left',
			render: (value) => <div>{value?.join(',')}</div>,
		},
		{
			title: 'Item Name',
			dataIndex: 'itemName',
			key: 'itemName',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'left',
		},
		{
			title: 'Hsn/Sac',
			dataIndex: 'hsnSac',
			key: 'hsnSac',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'left',
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'left',
		},
		{
			title: 'Rate',
			dataIndex: 'rate',
			key: 'rate',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'left',
		},
		{
			title: 'Total Amount',
			dataIndex: 'totalAmount',
			key: 'totalAmount',
			// sorter: (a, b) => a?.userId?.lastName?.localeCompare(b?.userId?.lastName),
			align: 'right',
		},
	];

	return (
		<Row className="ticket_details_container">
			<Col xl={24}>
				<TableComponent
					loading={loading}
					className="custom-table"
					style={{ width: '100%' }}
					columns={column}
					bordered
					rowKey={(record) => record._id}
					dataSource={ticketDetails?.sales || []}
                    pagination={false}
				/>
			</Col>
		</Row>
	);
};

export default Sales;
