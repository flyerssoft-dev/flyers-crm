import React from 'react';
import { Table } from 'antd';
import InfiniteLoader from 'components/infinite-loader';
import './style.scss';

const loaderIcon = <InfiniteLoader />;

const TableComponent = ({
	columns,
	dataSource,
	className,
	bordered = true,
	rowKey,
	title,
	pagination,
	footer,
	onChange,
	loading = false,
	...rest
}) => {
	return (
		<Table
			{...{
				loading: { indicator: loaderIcon, spinning: loading },
				className: `table-component ${className}`,
				// columns: loading
				// 	? columns.map((column) => {
				// 			return {
				// 				...column,
				// 				render: function renderPlaceholder() {
				// 					return <Skeleton key={column.dataIndex} title={true} active paragraph={false} style={{ width: '100%' }} />;
				// 				},
				// 			};
				// 	  })
				// 	: columns,
				columns,
				dataSource,
				bordered,
				rowKey,
				title,
				pagination,
				footer,
				onChange,
				 scroll: { x: 'max-content' },
				...rest,
			}}
		/>
	);
};

export default TableComponent;
