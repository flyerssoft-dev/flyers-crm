import React, { useState, useCallback } from 'react';
import { Modal, Row, Col, Divider, Select, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BiSolidPlusCircle } from 'react-icons/bi';
import { v4 as uuidv4 } from 'uuid';
import TableComponent from 'components/table-component';
import './editable-category-modal.scss';

let itemDefaultRecord = {
	name: null,
	sacNumber: null,
	date: null,
	whousers: null,
	whkg: null,
	amc: null,
	others: null,
	lrCharges: null,
	rowId: uuidv4(),
};

const EditableCategoryModal = ({ value = {}, onChange }) => {
	const [categoryModal, setCategoryModal] = useState(false);
	const [tableData, setTableData] = useState([{ ...itemDefaultRecord, rowId: uuidv4() }]);
	const selectRef = React.useRef(null);
	const column = [
		{
			title: 'CATEGORY NAME',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '20%',
			align: 'left',
			render: (value, record) => (
				<Input
					placeholder="Name"
					autoFocus
					// value={value}
					// className={`${record?.lrNumber && !value ? 'error' : ''}`}
					// onChange={({ target: { value } }) => handleInputChange('lrNumber', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'MARGIN',
			dataIndex: 'profitMargin',
			key: 'profitMargin',
			width: '10%',
			align: 'left',
			render: (value, record) => (
				<Input
					type="number"
					pattern="^-?[0-9]\d*\.?\d*$"
					placeholder="Margin"
					// value={value}
					// className={`${record?.lrNumber && !value ? 'error' : ''}`}
					// onChange={({ target: { value } }) => handleInputChange('lrNumber', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'REMARKS',
			dataIndex: 'remarks',
			key: 'remarks',
			width: '20%',
			align: 'left',
			render: (value, record) => (
				<Input
					placeholder="Remarks"
					// value={value}
					// className={`${record?.lrNumber && !value ? 'error' : ''}`}
					// onChange={({ target: { value } }) => handleInputChange('lrNumber', parseFloat(value), record?.id)}
				/>
			),
		},
		{
			title: 'Default?',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<div className="show-on-hover" onClick={() => handleMarkAsRead(record)}>
					Mark as default
				</div>
			),
		},
		{
			title: 'Delete',
			dataIndex: 'itemId',
			key: 'itemId',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<div className="show-on-hover delete" onClick={() => handleRemove(record?.rowId)}>
					Delete
				</div>
			),
		},
	];

	const handleMarkAsRead = (record) => {
		console.log('🚀 ~ file: index.js:47 ~ handleMarkAsRead ~ record:', record);
	};

	const handleInputKeyDown = () => {
		if (selectRef.current) {
			selectRef.current.blur();
			setCategoryModal(true);
		}
	};

	const handleRemove = (id) => {
		const data = tableData.filter((data) => data.rowId !== id);
		setTableData([...data]);
	};

	const handleAddTableData = useCallback(() => {
		let data = [...tableData];
		data.push({
			...itemDefaultRecord,
			rowId: uuidv4(),
		});
		setTableData(data);
	}, [tableData]);

	return (
		<>
			<Select
				onChange={onChange}
				ref={selectRef}
				placeholder="Select category"
				dropdownRender={(menu) => (
					<div>
						{menu}
						<Divider />
						<div style={{ display: 'flex', flexWrap: 'nowrap' }}>
							<a
								href
								style={{ flex: 'none', color: '#188dfa', padding: '8px', display: 'block', cursor: 'pointer' }}
								onClick={() => {
									handleInputKeyDown();
								}}>
								<PlusOutlined /> Unit
							</a>
						</div>
					</div>
				)}>
				<Select.Option value="General">General</Select.Option>
			</Select>

			<Modal
				title={
					<Row>
						<Col span={24}>
							<Row>
								<Col span={24}>Categories</Col>
							</Row>
							{/* <Row>
								<Col span={3}>#: {selectedViewRow?.orderNumber}</Col>
								<Col span={7} />
								<Col span={14}>{selectedViewRow?.customerId?.displayName}</Col>
							</Row> */}
						</Col>
					</Row>
				}
				// title={`${selectedViewRow?.customerId?.displayName} | ${selectedViewRow?.orderNumber}`}
				// okButtonProps={{ style: { display: 'none' } }}
				cancelButtonProps={{ onPress: () => setCategoryModal(false) }}
				// onCancel={() => setCategoryModal(false)}
				open={categoryModal}
				style={{ top: 0 }}
				width={'60%'}>
				<Row className="editable-add-category">
					<Col span={24}>
						<TableComponent
							className="add-table"
							style={{ width: '100%' }}
							rowKey={(record) => record._id}
							dataSource={tableData}
							columns={column}
							pagination={false}
						/>
						<Row>
							<Col className="add-button" onClick={handleAddTableData}>
								<BiSolidPlusCircle /> Add Item
							</Col>
						</Row>
					</Col>
				</Row>
			</Modal>
		</>
	);
};

export default EditableCategoryModal;
