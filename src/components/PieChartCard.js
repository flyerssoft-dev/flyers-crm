import React, { useState } from 'react';
import { Card, Modal, Select } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const { Option } = Select;

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#f87171', '#60a5fa'];

const fullData = [
	{ name: 'Completed', value: 400, type: 'active' },
	{ name: 'In Progress', value: 300, type: 'active' },
	{ name: 'Pending', value: 200, type: 'active' },
	{ name: 'Overdue', value: 100, type: 'warning' },
	{ name: 'Cancelled', value: 50, type: 'cancelled' },
];

const CustomLegend = ({ payload, onHover, onLeave }) => (
	<div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: 16 }}>
		{payload.map((entry, index) => (
			<div
				key={index}
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					cursor: 'pointer',
					transition: 'transform 0.2s',
				}}
				onMouseEnter={() => onHover(index)}
				onMouseLeave={() => onLeave()}>
				<div
					style={{
						width: 12,
						height: 12,
						borderRadius: '50%',
						backgroundColor: COLORS[index % COLORS.length],
						boxShadow: '0 0 6px rgba(0,0,0,0.15)',
						transition: 'transform 0.3s',
					}}
				/>
				<span style={{ fontSize: 13, color: '#444' }}>{entry.value}</span>
			</div>
		))}
	</div>
);

const PieChartCard = ({ title = 'Sales Overview' }) => {
	const [activeIndex, setActiveIndex] = useState(null);
	const [modalData, setModalData] = useState(null);
	const [filter, setFilter] = useState('all');

	const filteredData = filter === 'all' ? fullData : fullData.filter((d) => d.type === filter);

	const total = filteredData.reduce((sum, item) => sum + item.value, 0);

	const handleClick = (_, index) => {
		setActiveIndex(index);
		setModalData(filteredData[index]);
	};

	return (
		<>
			<Card
				className="dashboard_card"
				style={{
					borderRadius: 12,
					boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
					padding: 24,
					display: 'flex',
					flexDirection: 'column'
				}}>
				<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
					<h3 style={{ fontWeight: 600 }}>{title}</h3>
					<Select size="small" value={filter} onChange={(value) => setFilter(value)} style={{ width: 140 }}>
						<Option value="all">All</Option>
						<Option value="active">Active Only</Option>
						<Option value="warning">Overdue</Option>
						<Option value="cancelled">Cancelled</Option>
					</Select>
				</div>

				<ResponsiveContainer width="100%" height={260}>
					<PieChart>
						<Pie
							data={filteredData}
							dataKey="value"
							innerRadius={70}
							outerRadius={100}
							paddingAngle={2}
							onClick={handleClick}
							activeIndex={activeIndex}
							isAnimationActive
							label={({ cx, cy }) => (
								<text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 14, fontWeight: 600 }}>
									Total: {total}
								</text>
							)}>
							{filteredData.map((_, index) => (
								<Cell key={index} fill={COLORS[index % COLORS.length]} cursor="pointer" />
							))}
						</Pie>
						<Legend
							content={
								<CustomLegend
									payload={filteredData.map((entry, index) => ({
										value: entry.name,
										color: COLORS[index % COLORS.length],
									}))}
									onHover={(index) => setActiveIndex(index)}
									onLeave={() => setActiveIndex(null)}
								/>
							}
						/>
					</PieChart>
				</ResponsiveContainer>
			</Card>

			<Modal open={!!modalData} onCancel={() => setModalData(null)} title={modalData?.name} footer={null}>
				<p>
					<strong>Value:</strong> {modalData?.value}
				</p>
				<p>
					<strong>Percentage:</strong> {modalData ? ((modalData.value / total) * 100).toFixed(1) + '%' : ''}
				</p>
			</Modal>
		</>
	);
};

export default PieChartCard;
