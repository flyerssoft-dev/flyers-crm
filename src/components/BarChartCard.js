import React, { useState } from 'react';
import { Card, Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const { Option } = Select;

const BAR_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f87171', '#60a5fa', '#a78bfa'];

const allData = {
	sales: [
		{ name: 'Jan', value: 120 },
		{ name: 'Feb', value: 200 },
		{ name: 'Mar', value: 150 },
		{ name: 'Apr', value: 180 },
		{ name: 'May', value: 90 },
		{ name: 'Jun', value: 240 },
	],
	revenue: [
		{ name: 'Jan', value: 220 },
		{ name: 'Feb', value: 160 },
		{ name: 'Mar', value: 300 },
		{ name: 'Apr', value: 210 },
		{ name: 'May', value: 180 },
		{ name: 'Jun', value: 260 },
	],
	expenses: [
		{ name: 'Jan', value: 100 },
		{ name: 'Feb', value: 120 },
		{ name: 'Mar', value: 140 },
		{ name: 'Apr', value: 80 },
		{ name: 'May', value: 60 },
		{ name: 'Jun', value: 100 },
	],
};

const CustomTooltip = ({ active, payload }) => {
	if (active && payload && payload.length) {
		return (
			<div
				style={{
					backgroundColor: '#fff',
					border: '1px solid #ddd',
					padding: 10,
					borderRadius: 6,
					fontSize: 13,
				}}>
				<strong>{payload[0].payload.name}</strong>
				<div>Value: {payload[0].value}</div>
			</div>
		);
	}
	return null;
};

const BarChartCard = ({ title = 'Monthly Report' }) => {
	const [selectedType, setSelectedType] = useState('sales');

	const data = allData[selectedType];

	return (
		<Card
			className="dashboard_card"
			style={{
				borderRadius: 12,
				boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
				padding: 16,
			}}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
				<h3 style={{ fontWeight: 600 }}>{title}</h3>
				<Select size="small" value={selectedType} onChange={setSelectedType} style={{ width: 130 }}>
					<Option value="sales">Sales</Option>
					<Option value="revenue">Revenue</Option>
					<Option value="expenses">Expenses</Option>
				</Select>
			</div>

			<ResponsiveContainer width="100%" height={250}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" vertical={false} />
					<XAxis dataKey="name" />
					<YAxis />
					<Tooltip content={<CustomTooltip />} />
					<Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive>
						{data.map((_, index) => (
							<Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</Card>
	);
};

export default BarChartCard;
