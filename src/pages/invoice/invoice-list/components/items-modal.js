import React, { useMemo } from 'react';
import { Modal, Row, Col } from 'antd';
import TableComponent from 'components/table-component';
import { getTheRoundOffValue } from 'helpers';

const formatAmount = (val) => parseFloat(val || 0).toFixed(2);

const ItemsModal = ({ setSelectedViewRow, selectedViewRow = null }) => {
	const items = selectedViewRow?.items || [];
	const totalAmount = useMemo(() => items.reduce((acc, item) => acc + (item.totalAmount || 0), 0), [items]);
	const roundOff = getTheRoundOffValue(totalAmount + (selectedViewRow?.shipping || 0) + (selectedViewRow?.discount || 0));

	const columns = useMemo(() => [
		{ title: '#', key: 'sno', width: '5%', align: 'center', render: (_, __, index) => index + 1 },
		{ title: 'Item', dataIndex: ['itemId', 'itemName'], key: 'itemId', width: '20%', align: 'left' },
		{ title: 'Qty', dataIndex: 'qty', key: 'qty', width: '10%', align: 'right' },
		{ title: 'Rate', dataIndex: 'rate', key: 'rate', width: '10%', align: 'right', render: formatAmount },
		{ title: 'Tax', dataIndex: 'taxRate', key: 'taxRate', width: '5%', align: 'right', render: (val) => `${val || 0}%` },
		{ title: 'Tax Value', dataIndex: 'taxAmount', key: 'taxAmount', width: '5%', align: 'right', render: formatAmount },
		{ title: 'Total', dataIndex: 'totalAmount', key: 'totalAmount', width: '10%', align: 'right', render: formatAmount },
	], []);

	const renderSummaryRow = (label, value) => (
		<Row style={{ fontSize: 14 }}>
			<Col xl={21} md={21} style={{ textAlign: 'right', paddingRight: 10 }}>{label}</Col>
			<Col xl={1} md={1}>:</Col>
			<Col xl={2} md={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>{formatAmount(value)}</Col>
		</Row>
	);

	return (
		<Modal
			title={
				<Row>
					<Col span={24}>
						<Row>
							<Col span={3}>#: {selectedViewRow?.orderNumber}</Col>
							<Col span={7} />
							<Col span={14}>{selectedViewRow?.customerId?.displayName}</Col>
						</Row>
					</Col>
				</Row>
			}
			okButtonProps={{ style: { display: 'none' } }}
			onCancel={() => setSelectedViewRow(null)}
			open={items.length > 0}
			width="60%"
		>
			<TableComponent
				className="custom-table"
				style={{ width: '100%' }}
				rowKey={(record) => record._id}
				dataSource={items}
				columns={columns}
				pagination={false}
				footer={() => (
					<Row>
						<Col span={24}>
							{renderSummaryRow('Shipping Charges', selectedViewRow?.shipping)}
							{renderSummaryRow('Discount', selectedViewRow?.discount)}
							{renderSummaryRow('Round Off', roundOff?.remain)}
							{renderSummaryRow('Grand Total', roundOff?.value)}
						</Col>
					</Row>
				)}
			/>
		</Modal>
	);
};

export default ItemsModal;
