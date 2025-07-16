import React from 'react';
import { Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{ name: 'Page A', uv: 300 },
	{ name: 'Page B', uv: 600 },
	{ name: 'Page C', uv: 200 },
];

const SimpleBarChartCard = () => (
	<Card title="Traffic Overview" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
		<ResponsiveContainer width="100%" height={250}>
			<BarChart data={data}>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis />
				<Tooltip />
				<Bar dataKey="uv" fill="#82ca9d" />
			</BarChart>
		</ResponsiveContainer>
	</Card>
);

export default SimpleBarChartCard;
