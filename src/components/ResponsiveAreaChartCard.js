import React from 'react';
import { Card } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
	{ month: 'Jan', uv: 400 },
	{ month: 'Feb', uv: 300 },
	{ month: 'Mar', uv: 500 },
	{ month: 'Apr', uv: 200 },
	{ month: 'May', uv: 278 },
	{ month: 'Jun', uv: 189 },
];

const ResponsiveAreaChartCard = () => (
	<Card title="User Growth" style={{ borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
		<ResponsiveContainer width="100%" height={250}>
			<AreaChart data={data}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<XAxis dataKey="month" />
				<YAxis />
				<Tooltip />
				<Area type="monotone" dataKey="uv" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
			</AreaChart>
		</ResponsiveContainer>
	</Card>
);

export default ResponsiveAreaChartCard;
