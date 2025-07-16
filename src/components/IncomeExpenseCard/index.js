import React, { useState } from 'react';
import { Card, Select, Segmented } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import './IncomeExpenseCard.scss';

const { Option } = Select;

const data = [
	{ month: 'Apr 2025', income: 25000, expense: 10000 },
	{ month: 'May 2025', income: 220000, expense: 104000 },
	{ month: 'Jun 2025', income: 20266.18, expense: 0 },
	{ month: 'Jul 2025', income: 0, expense: 0 },
	{ month: 'Aug 2025', income: 0, expense: 0 },
	{ month: 'Sep 2025', income: 0, expense: 0 },
	{ month: 'Oct 2025', income: 0, expense: 0 },
	{ month: 'Nov 2025', income: 0, expense: 0 },
	{ month: 'Dec 2025', income: 0, expense: 0 },
	{ month: 'Jan 2026', income: 0, expense: 0 },
	{ month: 'Feb 2026', income: 0, expense: 0 },
	{ month: 'Mar 2026', income: 0, expense: 0 },
];

const CustomTooltip = ({ active, payload }) => {
	if (active && payload?.length) {
		return (
			<div className="tooltip-box">
				<strong>{payload[0].payload.month}</strong>
				{payload.map((p, i) => (
					<div key={i} style={{ color: p.fill }}>
						{p.name}: ₹{p.value.toLocaleString('en-IN')}
					</div>
				))}
			</div>
		);
	}
	return null;
};

const IncomeExpenseCard = () => {
	const [mode, setMode] = useState('Cash');

	const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
	const totalExpense = data.reduce((sum, d) => sum + d.expense, 0);

	return (
		<div className="income-expense-card-container">
			<h3>Monthly</h3>
			<Card className="income-expense-card" bordered={false}>
				<div className="header">
					<h4>Income and Expense</h4>
					<Select defaultValue="This Fiscal Year" size="small" bordered={false}>
						<Option value="fy">This Fiscal Year</Option>
					</Select>
				</div>

				<div className="mode-toggle">
					<Segmented size="small" value={mode} options={['Accrual', 'Cash']} onChange={setMode} />
				</div>

				<ResponsiveContainer width="100%" height={250}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="month" fontSize={11} />
						<YAxis tickFormatter={(val) => `${Math.round(val / 1000)}K`} fontSize={11} />
						<Tooltip content={<CustomTooltip />} />
						<Legend verticalAlign="top" height={30} />
						<Bar dataKey="income" name="Income" fill="#22c55e" barSize={20} radius={[4, 4, 0, 0]} />
						<Bar dataKey="expense" name="Expense" fill="#f87171" barSize={20} radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>

				<div className="summary-footer">
					<div className="summary-legend">
						<div className="legend-item">
							<span className="dot income" /> Income
						</div>
						<div className="legend-item">
							<span className="dot expense" /> Expense
						</div>
					</div>

					<div className="summary-values">
						<div className="value-block">
							<div className="label income">Total Income</div>
							<div className="amount">₹{totalIncome.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
						</div>
						<div className="value-block">
							<div className="label expense">Total Expenses</div>
							<div className="amount">₹{totalExpense.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
						</div>
					</div>

					<div className="disclaimer">* Income and expense values displayed are exclusive of taxes.</div>
				</div>
			</Card>
		</div>
	);
};

export default IncomeExpenseCard;
