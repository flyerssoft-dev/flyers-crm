import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Tag } from 'antd';
// import { AiOutlineSearch } from 'react-icons/ai';
import TableComponent from 'components/table-component';
import { sendGetRequest } from 'redux/sagas/utils';
import { SERVER_IP } from 'assets/Config';
import { STATUS } from 'constants/app-constants';

const StockSerial = ({ selectedRow }) => {
	const globalRedux = useSelector((state) => state.globalRedux);
	// const [searchKey, setSearchKey] = useState('');
	const [tableData, setTableData] = useState({
		data: [],
		loading: false,
	});

	const column = [
		{
			title: 'Serial No',
			dataIndex: 'serial',
			key: 'serial',
			sorter: (a, b) => a?.serial?.localeCompare(b?.serial),
			width: '70%',
		},
		{
			title: 'Status',
			dataIndex: 'status',
			width: '30%',
			sorter: (a, b) => a?.status?.localeCompare(b?.status),
			align: 'center',
			render: (value) => (value ? <Tag color={STATUS[value]}>{value}</Tag> : null)
		},
	];

	const getStockSerial = useCallback(
		async (itemId) => {
			await setTableData(tableData => ({
				...tableData,
				loading: true,
			}));
			const res = await sendGetRequest(null, `${SERVER_IP}stock?orgId=${globalRedux?.selectedOrganization?.id}&itemId=${itemId}`);
			console.log('🚀 ~ file: stock-serial-component.js:49 ~ getStockSerial ~ res:', res?.data?.data);
			await setTableData(tableData => ({
				data: res?.data?.data,
				loading: false,
			}));
		},
	  [],
	)

	useEffect(() => {
		getStockSerial(selectedRow?._id);
	}, [selectedRow?._id, getStockSerial]);

	return (
		<Row>
			<Col span={12}>
				<TableComponent
					loading={tableData?.loading}
					className="custom-table"
					style={{ width: '100%' }}
					rowKey={(record) => record._id}
					dataSource={tableData?.data}
					pagination={false}
					// title={() => (
					// 	<Row align={'middle'} justify={'space-between'} gutter={[10, 10]}>
					// 		<Col span={24}>
					// 			<h5 style={{ textAlign: 'center' }}>Stock Serials</h5>
					// 			<Input placeholder="Search" suffix={<AiOutlineSearch />} onChange={({ target: { value } }) => setSearchKey(value)} />
					// 		</Col>
					// 	</Row>
					// )}
					{...{
						columns: column,
					}}
				/>
			</Col>
		</Row>
	);
};

export default StockSerial;
