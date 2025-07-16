import React from 'react';
import { Card } from 'antd';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
	labels: ['Marketing', 'Sales', 'Development'],
	datasets: [
		{
			data: [300, 500, 200],
			backgroundColor: ['#60a5fa', '#f87171', '#34d399'],
			borderWidth: 1,
		},
	],
};

const DoughnutChartCard = () => (
	<Card
		title="Department Budget"
		style={{
			borderRadius: 12,
			boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
			padding: 16,
		}}>
		<div style={{ height: 250 }}>
			<Doughnut data={data} height={250} options={{ maintainAspectRatio: false }} />
		</div>
	</Card>
);

export default DoughnutChartCard;
