import React from 'react';
import { Modal } from 'antd';
import { getDateFormat } from 'services/Utils';
import TableComponent from 'components/table-component';

const InvoiceReceiptDetailModal = ({ setSelectedViewRow, selectedViewRow }) => {
	const column = [
		{
			title: '#',
			dataIndex: 'receiptNumber',
			key: 'receiptNumber',
			sorter: (a, b) => a?.receiptNumber - b?.receiptNumber,
			width: '5%',
			render: (value) => <span>{value}</span>,
		},
		{
			title: 'Receipt Date',
			dataIndex: 'receiptDate',
			key: 'receiptDate',
			width: '15%',
			sorter: (a, b) => new Date(a.receiptDate) - new Date(b.receiptDate),
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Payment Mode',
			dataIndex: 'paymentMode',
			key: 'paymentMode',
			sorter: (a, b) => a?.paymentMode?.localeCompare(b?.paymentMode),
			width: '10%',
			render: (value) => <span>{value}</span>,
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
			sorter: (a, b) => a?.amount - b?.amount,
			width: '10%',
			render: (value) => <span>{value}</span>,
		},
	];
	return (
		<Modal
			title="Receipt Details"
			okButtonProps={{ style: { display: 'none' } }}
			onCancel={() => setSelectedViewRow(null)}
			open={(selectedViewRow?.length || 0) > 0}
			width={'60%'}>
			<TableComponent
				className="custom-table"
				style={{ width: '100%' }}
				rowKey={(record) => record._id}
				dataSource={selectedViewRow}
				columns={column}
				pagination={false}
			/>
		</Modal>
	);
};

export default InvoiceReceiptDetailModal;
