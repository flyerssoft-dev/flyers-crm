import React from 'react';
import { Row, Col, Button, Card, Divider, Avatar, Typography } from 'antd';
import ContentLoader from 'react-content-loader';

const { Text, Title } = Typography;

export const OverviewLoader = () => (
	<Row gutter={16}>
		<Col span={12}>
			<Card>
				<Row gutter={16} style={{ padding: 10 }}>
					<Col span={4}>
						<ContentLoader speed={2} width={60} height={60} viewBox="0 0 60 60" backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<circle cx="30" cy="30" r="30" />
						</ContentLoader>
					</Col>
					<Col span={20}>
						<ContentLoader speed={2} width="100%" height={50} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="10" rx="4" ry="4" width="150" height="15" />
							<rect x="0" y="30" rx="4" ry="4" width="200" height="10" />
						</ContentLoader>
						<br />
						{/* <Button type="link" disabled>
							Invite to Portal
						</Button>
						<Button type="link" disabled>
							Send Email
						</Button> */}
					</Col>
				</Row>
				<Divider />
				<Row gutter={16} style={{ padding: 10 }}>
					<Col span={12}>
						<Title level={5}>Billing Address</Title>
						<ContentLoader speed={2} width="100%" height={50} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="10" rx="4" ry="4" width="150" height="15" />
							<rect x="0" y="30" rx="4" ry="4" width="200" height="10" />
						</ContentLoader>
						<br />
						<Button type="link" disabled>
							+ New Address
						</Button>
					</Col>
					<Col span={12}>
						<Title level={5}>Shipping Address</Title>
						<ContentLoader speed={2} width="100%" height={20} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="10" rx="4" ry="4" width="150" height="15" />
						</ContentLoader>
						<br />
						<Button type="link" disabled>
							+ New Address
						</Button>
					</Col>
				</Row>
				<Divider />
				<Row gutter={16} style={{ padding: 10 }}>
					<Col span={12}>
						<ContentLoader speed={2} width="100%" height={60} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="10" rx="4" ry="4" width="180" height="15" />
							<rect x="0" y="30" rx="4" ry="4" width="180" height="15" />
							<rect x="0" y="50" rx="4" ry="4" width="180" height="15" />
						</ContentLoader>
					</Col>
					<Col span={12}>
						<ContentLoader speed={2} width="100%" height={50} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="10" rx="4" ry="4" width="180" height="15" />
							<rect x="0" y="30" rx="4" ry="4" width="180" height="15" />
						</ContentLoader>
						<br />
						<Button type="link" disabled>
							Contact Persons
						</Button>
					</Col>
				</Row>
			</Card>
		</Col>
		<Col span={12}>
			<Card>
				<Title level={5}>Receivables</Title>
				<Row>
					<Col span={12}>
						<Text>Outstanding Receivables:</Text>
					</Col>
					<Col span={12}>
						<ContentLoader speed={2} width={100} height={15} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="0" rx="4" ry="4" width="100" height="15" />
						</ContentLoader>
					</Col>
				</Row>
				<Row style={{ paddingBottom: 10 }}>
					<Col span={12}>
						<Text>Unused Credits:</Text>
					</Col>
					<Col span={12}>
						<ContentLoader speed={2} width={100} height={15} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
							<rect x="0" y="0" rx="4" ry="4" width="100" height="15" />
						</ContentLoader>
					</Col>
				</Row>
				<Button type="link" disabled>
					Enter Opening Balance
				</Button>
				<Divider />
				<Title level={5}>Income</Title>
				<ContentLoader speed={2} width={180} height={15} backgroundColor="#f3f3f3" foregroundColor="#ecebeb">
					<rect x="0" y="0" rx="4" ry="4" width="180" height="15" />
				</ContentLoader>
			</Card>
		</Col>
	</Row>
);

const Overview = ({ customerDetails }) => {
	return (
		<Row gutter={16}>
			<Col span={12}>
				<Card>
					<Row gutter={16}>
						<Col span={4}>
							<Avatar style={{ backgroundColor: '#f56a00', verticalAlign: 'middle' }} size="large" gap={4}>
								{customerDetails.displayName}
							</Avatar>
						</Col>
						<Col span={20} style={{ padding: 10, paddingTop: 0 }}>
							<Title level={4} style={{ margin: 0 }}>
								{customerDetails.displayName}
							</Title>
							<Text>{customerDetails.email}</Text>
							<br />
							{/* <Button type="link">Invite to Portal</Button>
										<Button type="link">Send Email</Button> */}
						</Col>
					</Row>
					<Divider />
					<Row gutter={16} style={{ padding: 10 }}>
						<Col span={12}>
							<Title level={5}>Billing Address</Title>
							{customerDetails?.billingDetails?.length ? (
								<Text>
									{customerDetails?.billingDetails[0]?.addressLine1 || '-'}
									<br />
									{customerDetails?.billingDetails[0]?.addressLine2 || '-'}
									<br />
									{customerDetails?.billingDetails[0]?.city} - {customerDetails?.billingDetails[0]?.pincode}
								</Text>
							) : (
								<Text>No Billing Address</Text>
							)}
							<br />
							{/* <Button type="link">+ New Address</Button> */}
						</Col>
						<Col span={12}>
							<Title level={5}>Shipping Address</Title>
							<Text>No Shipping Address</Text>
							<br />
							{/* <Button type="link">+ New Address</Button> */}
						</Col>
					</Row>
					<Divider />
					<Row gutter={16} style={{ padding: 10 }}>
						<Col span={12}>
							<Text>Customer Type: {customerDetails.category}</Text>
							<br />
							<Text>Default Currency: INR</Text>
							<br />
							<Text>Portal Status: Disabled</Text>
						</Col>
						<Col span={12}>
							<Text>Portal Language: English</Text>
							<br />
							{/* <Button type="link">Contact Persons</Button> */}
						</Col>
					</Row>
				</Card>
			</Col>
			<Col span={12}>
				<Card>
					<Title level={5}>Receivables</Title>
					<Row>
						<Col span={12}>
							<Text>Outstanding Receivables:</Text>
						</Col>
						<Col span={12}>
							<Text>₹{customerDetails.openingBalance}</Text>
						</Col>
					</Row>
					<Row style={{ paddingBottom: 10 }}>
						<Col span={12}>
							<Text>Unused Credits:</Text>
						</Col>
						<Col span={12}>
							<Text>₹{customerDetails.closingBalance}</Text>
						</Col>
					</Row>
					{/* <Button type="link">Enter Opening Balance</Button> */}
					<Divider />
					<Col style={{ paddingTop: 10 }}>
						<Title level={5}>Income</Title>
						<Text>Total Income (Last 6 months): ₹0.00</Text>
					</Col>
				</Card>
			</Col>
		</Row>
	);
};

export default Overview;
