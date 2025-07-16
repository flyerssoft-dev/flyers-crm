import React from 'react';
import { Modal, Row, Col } from 'antd';
import TableComponent from 'components/table-component';
// import { getTheRoundOffValue } from 'helpers';

const ItemsModal = ({ setSelectedViewRow, selectedViewRow = null }) => {
	const column = [
		{
			title: '#',
			dataIndex: 'sno',
			key: 'sno',
			width: '5%',
			align: 'center',
			render: (value, record, index) => <div>{index + 1}</div>,
		},
		{
			title: 'Item',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '20%',
			align: 'left',
			render: (value, record, index) => <div>{value?.itemName}</div>,
		},
		{
			title: 'Quantity',
			dataIndex: 'qty',
			key: 'qty',
			width: '10%',
			align: 'right',
		},
		// {
		// 	title: 'Total',
		// 	dataIndex: 'totalAmount',
		// 	key: 'totalAmount',
		// 	width: '10%',
		// 	align: 'right',
		// 	render: (value, record) => parseFloat(value || 0).toFixed(2),
		// },
	];

	// const totalAmount = useMemo(() => selectedViewRow?.items?.reduce((accum, item) => accum + item.totalAmount, 0) || 0, [selectedViewRow?.items]);
	// const roundOff = getTheRoundOffValue(totalAmount);

	return (
		<Modal
			title={
				<Row>
					{/* <Col span={24}>
						<Row>
							<Col span={3}>Customer</Col>
							<Col span={1}>:</Col>
							<Col span={20}>{selectedViewRow?.customerId?.displayName}</Col>
						</Row>
					</Col> */}
					<Col span={24}>
						<Row>
							<Col span={3}>#: {selectedViewRow?.inventoryNumber}</Col>
							<Col span={7} />
							{/* <Col span={14}>{selectedViewRow?.customerId?.displayName}</Col> */}
						</Row>
					</Col>
				</Row>
			}
			// title={`${selectedViewRow?.customerId?.displayName} | ${selectedViewRow?.orderNumber}`}
			okButtonProps={{ style: { display: 'none' } }}
			onCancel={() => setSelectedViewRow(null)}
			open={(selectedViewRow?.items?.length || 0) > 0}
			width={'50%'}>
			<TableComponent
				className="custom-table"
				style={{ width: '100%' }}
				rowKey={(record) => record._id}
				dataSource={selectedViewRow?.items || []}
				columns={column}
				pagination={false}
				// footer={() => (
				// 	<Row style={{ fontSize: 14 }}>
				// 		<Col xl={21} md={21} style={{ textAlign: 'right', paddingRight: 10 }}>
				// 			Grand Total
				// 		</Col>
				// 		<Col xl={1} md={1}>
				// 			:
				// 		</Col>
				// 		<Col xl={2} md={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>
				// 			{parseFloat(roundOff?.value).toFixed(2)}
				// 		</Col>
				// 	</Row>
				// )}
			/>
		</Modal>
	);
};

export default ItemsModal;
