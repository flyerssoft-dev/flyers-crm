import React, { useState, useEffect } from 'react';
import './ticket-table.scss';

const TicketTable = ({ tableData, isLoading = false }) => {
	const [sortedData, setSortedData] = useState([]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

	useEffect(() => {
		if (tableData) {
			setSortedData([...tableData]);
		}
	}, [tableData]);

	const onSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		const sorted = [...sortedData].sort((a, b) => {
			const valA = a[key] ?? 0;
			const valB = b[key] ?? 0;
			if (valA < valB) return direction === 'asc' ? -1 : 1;
			if (valA > valB) return direction === 'asc' ? 1 : -1;
			return 0;
		});
		setSortedData(sorted);
		setSortConfig({ key, direction });
	};

	const renderHeader = (label, key) => (
		<th onClick={() => onSort(key)} className="sortable">
			{label}
			{sortConfig.key === key && (
				<span className="sort-arrow">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
			)}
		</th>
	);

	return (
		<div className="table-wrapper">
			<table className="styled-table" id="payments">
				<thead>
					<tr>
						{renderHeader('Username', 'Username')}
						{renderHeader('Open', 'Open')}
						{renderHeader('Completed', 'Completed')}
						{renderHeader('Accepted', 'Accepted')}
						{renderHeader('Pending', 'Pending')}
						{renderHeader('InProgress', 'InProgress')}
					</tr>
				</thead>
				<tbody>
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => (
								<tr key={`loading-${i}`}>
									{Array.from({ length: 6 }).map((_, j) => (
										<td key={j}>
											<div className="skeleton"></div>
										</td>
									))}
								</tr>
						  ))
						: sortedData?.map((ticket, index) => {
								const isUnassigned = ticket?.Username === 'Unassigned';
								const cellStyle = {
									textAlign: 'center',
									...(isUnassigned && {
										fontWeight: 'bold',
										color: '#c62828',
									}),
								};
								return (
									<tr key={index}>
										<td className={isUnassigned ? 'unassigned' : ''}>
											{ticket?.Username}
										</td>
										<td style={cellStyle}>{ticket?.Open}</td>
										<td style={cellStyle}>{ticket?.Completed}</td>
										<td style={cellStyle}>{ticket?.Accepted}</td>
										<td style={cellStyle}>{ticket?.Pending}</td>
										<td style={cellStyle}>{ticket?.InProgress}</td>
									</tr>
								);
						  })}
				</tbody>
			</table>
		</div>
	);
};

export default TicketTable;
