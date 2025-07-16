import React, { useRef, useEffect, useState } from 'react';
import { Card } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend);

const ProgressiveLineChartCard = () => {
	const chartRef = useRef(null);
	const [chartData, setChartData] = useState(data);

	useEffect(() => {
		if (!chartRef.current) return;

		const chart = chartRef.current;
		const ctx = chart.ctx;
		const gradient = ctx.createLinearGradient(0, 0, 0, 250);
		gradient.addColorStop(0, 'rgba(59,130,246,0.5)');
		gradient.addColorStop(1, 'rgba(59,130,246,0.05)');

		setChartData({
			...data,
			datasets: [
				{
					...data.datasets[0],
					backgroundColor: gradient,
				},
			],
		});
	}, []);

	const options = {
		maintainAspectRatio: false,
		animation: {
			duration: 2000,
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: '#f0f0f0',
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: '#fff',
				borderColor: '#ccc',
				borderWidth: 1,
				titleColor: '#000',
				bodyColor: '#000',
				padding: 10,
				titleFont: { size: 13 },
				bodyFont: { size: 13 },
				callbacks: {
					title: (tooltipItems) => `📅 Month: ${tooltipItems[0].label}`,
					label: (tooltipItem) => `💰 Revenue: $${tooltipItem.formattedValue}`,
				},
			},
		},
	};

	return (
		<Card
			title="📈 Monthly Revenue"
			style={{
				borderRadius: 12,
				boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
				padding: 16,
			}}>
			<div style={{ height: 250 }}>
				<Line ref={chartRef} data={chartData} options={options} height={250} />
			</div>
		</Card>
	);
};

const data = {
	labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
	datasets: [
		{
			label: 'Revenue Growth',
			data: [100, 300, 200, 400, 300, 500],
			borderColor: '#3b82f6',
			fill: true,
			tension: 0.4,
			pointBackgroundColor: '#3b82f6',
			pointRadius: 4,
			pointHoverRadius: 6,
		},
	],
};

export default ProgressiveLineChartCard;
