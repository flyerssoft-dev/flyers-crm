import React from 'react';
import { Collapse, Table, Typography } from 'antd';

const { Panel } = Collapse;
const { Link, Text } = Typography;

const invoicesColumns = [
	{ title: 'DATE', dataIndex: 'date', key: 'date' },
	{ title: 'INVOICE NUMBER', dataIndex: 'invoiceNumber', key: 'invoiceNumber', render: (text) => <Link>{text}</Link> },
	{ title: 'ORDER NUMBER', dataIndex: 'orderNumber', key: 'orderNumber' },
	{ title: 'AMOUNT', dataIndex: 'amount', key: 'amount' },
	{ title: 'BALANCE DUE', dataIndex: 'balanceDue', key: 'balanceDue' },
	{ title: 'STATUS', dataIndex: 'status', key: 'status', render: (text) => <Text type="secondary">{text}</Text> },
];

const invoicesData = [
	{
		key: '1',
		date: '26/01/2025',
		invoiceNumber: 'INV-000001',
		orderNumber: '1',
		amount: '₹300.00',
		balanceDue: '₹300.00',
		status: 'Draft',
	},
];

const customerPaymentsColumns = [
	{ title: 'DATE', dataIndex: 'date', key: 'date' },
	{ title: 'PAYMENT NUMBER', dataIndex: 'paymentNumber', key: 'paymentNumber' },
	{ title: 'REFERENCE NUM...', dataIndex: 'referenceNumber', key: 'referenceNumber' },
	{ title: 'PAYMENT MODE', dataIndex: 'paymentMode', key: 'paymentMode' },
	{ title: 'AMOUNT RECEIVED', dataIndex: 'amountReceived', key: 'amountReceived' },
	{ title: 'UNUSED AMOUNT', dataIndex: 'unusedAmount', key: 'unusedAmount' },
];

const customerPaymentsData = [];

const Transactions = () => {
	return (
		<>
			<div style={{ marginBottom: 16 }}>
				<Collapse defaultActiveKey={['1']}>
					<Panel
						header="Invoices"
						key="1"
						//   extra={<Button type="link">+ New</Button>}
					>
						<Table columns={invoicesColumns} dataSource={invoicesData} pagination={false} />
					</Panel>
				</Collapse>
			</div>

			<div style={{ marginBottom: 16 }}>
				<Collapse defaultActiveKey={['2']}>
					<Panel
						header="Customer Payments"
						key="2"
						//   extra={<Button type="link">+ New</Button>}
					>
						{customerPaymentsData.length > 0 ? (
							<Table columns={customerPaymentsColumns} dataSource={customerPaymentsData} pagination={false} />
						) : (
							<Text>No payments have been received or recorded yet.</Text>
						)}
					</Panel>
				</Collapse>
			</div>

			<div>
				<Collapse defaultActiveKey={['3']}>
					<Panel
						header="Quotes"
						key="3"
						//    extra={<Button type="link">+ New</Button>}
					>
						<Text>No quotes available.</Text>
					</Panel>
				</Collapse>
			</div>
		</>
	);
};

export default Transactions;
