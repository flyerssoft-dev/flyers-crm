import React from 'react';
import { Card } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{ name: 'Jan', uv: 400, pv: 240 },
	{ name: 'Feb', uv: 300, pv: 456 },
	{ name: 'Mar', uv: 200, pv: 139 },
	{ name: 'Apr', uv: 278, pv: 390 },
	{ name: 'May', uv: 189, pv: 480 },
];

const SynchronizedLineChartCard = () => (
	<Card title="Performance Comparison" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
		<ResponsiveContainer width="100%" height={250}>
			<LineChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Line type="monotone" dataKey="uv" stroke="#8884d8" />
				<Line type="monotone" dataKey="pv" stroke="#82ca9d" />
			</LineChart>
		</ResponsiveContainer>
	</Card>
);

export default SynchronizedLineChartCard;
