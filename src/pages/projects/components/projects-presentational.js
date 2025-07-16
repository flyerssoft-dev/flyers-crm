import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { Row, Col, Select, Button, Modal, Form, Input } from 'antd';
import { data, statuses } from 'data';
import DatePicker from 'components/date-picker';
import DropWrapper from './DropWrapper';
import Column from './Col';
import Item from './Item';
import { DATE_FORMAT } from 'constants/app-constants';

// const { RangePicker } = DatePicker;

const layer1FormCol = {
	labelCol: {
		span: 24,
	},
	wrapperCol: {
		span: 24,
	},
};

const ProjectsPresentational = ({
	projects,
	selectedProject,
	handleProjectChange,
	addModalVisible,
	setAddModalVisible,
	handleAddProject,
	customers,
	addingProject,
}) => {
	const [items, setItems] = useState(data);
	console.log('🚀 ~ file: projects-presentational.js:34 ~ items:', items);
	const [form] = Form.useForm();

	const onDrop = (item, monitor, status) => {
		console.log('🚀 ~ file: projects-presentational.js:38 ~ onDrop ~ item:', item);
		const mapping = statuses.find((si) => si.status === status);
		setItems((prevState) => {
			const newItems = prevState.filter((i) => i.id !== item.id).concat({ ...item, status, icon: mapping.icon });
			return [...newItems];
		});
	};

	const moveItem = (dragIndex, hoverIndex) => {
		const item = items[dragIndex];
		setItems((prevState) => {
			const newItems = prevState.filter((i, idx) => idx !== dragIndex);
			newItems.splice(hoverIndex, 0, item);
			return [...newItems];
		});
	};

	return (
		<Row>
			<Col xl={24} md={24} style={{ padding: 20, paddingBottom: 0 }}>
				<Select placeholder="Select Project" style={{ width: 150 }} onChange={(value) => handleProjectChange(value)}>
					{projects?.map((project) => (
						<Select.Option value={project._id}>{project?.projectName}</Select.Option>
					))}
				</Select>
				<Button onClick={() => setAddModalVisible(true)} type="primary" style={{ marginLeft: 10 }}>
					Add Project
				</Button>
				{selectedProject && (
					<Button
						// onClick={() => setAddModalVisible(true)}
						type="primary"
						style={{ marginLeft: 10 }}>
						Add Task
					</Button>
				)}
			</Col>
			<Col xl={24} md={24}>
				<DndProvider backend={Backend}>
					<div className={'rowStyle'}>
						{statuses.map((s) => {
							return (
								<div key={s.status} className={'col-wrapper'}>
									<h2 className={'col-header'}>{s.status.toUpperCase()}</h2>
									<DropWrapper onDrop={onDrop} status={s.status}>
										<Column>
											{items
												.filter((i) => i.status === s.status)
												.map((i, idx) => (
													<Item key={i.id} item={i} index={idx} moveItem={moveItem} status={s} />
												))}
										</Column>
									</DropWrapper>
								</div>
							);
						})}
					</div>
				</DndProvider>
			</Col>
			<Modal
				destroyOnHidden
				okButtonProps={{ loading: addingProject }}
				onOk={form.submit}
				onCancel={() => setAddModalVisible(false)}
				open={addModalVisible}
				title="Create Project">
				<Form onFinish={handleAddProject} form={form} {...layer1FormCol} colon={false} labelAlign="left">
					<Form.Item
						label="Title"
						name="title"
						rules={[
							{
								required: true,
								message: 'This Field is Required!',
							},
						]}>
						<Input placeholder="Title" />
					</Form.Item>
					<Form.Item
						label="Description"
						name="description"
						rules={[
							{
								required: true,
								message: 'This Field is Required!',
							},
						]}>
						<Input.TextArea placeholder="Description" />
					</Form.Item>
					<Form.Item
						label="Customer"
						name="customerId"
						rules={[
							{
								required: true,
								message: 'This Field is Required!',
							},
						]}>
						<Select placeholder="Select Project" style={{ width: '100%' }}>
							{customers?.map((customer) => (
								<Select.Option value={customer._id}>{customer?.displayName}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item
						label="Assigned User"
						name="assignedUser"
						rules={[
							{
								required: true,
								message: 'This Field is Required!',
							},
						]}>
						<Select placeholder="Select Project" style={{ width: '100%' }}>
							{customers?.map((customer) => (
								<Select.Option value={customer._id}>{customer?.displayName}</Select.Option>
							))}
						</Select>
					</Form.Item>
					<Row gutter={[10, 10]}>
						<Col xl={12} md={12}>
							<Form.Item
								label="Start Date"
								name="startDate"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<DatePicker format={DATE_FORMAT.MM_DD_YYYY} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col xl={12} md={12}>
							<Form.Item
								label="Due Date"
								name="dueDate"
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<DatePicker format={DATE_FORMAT.MM_DD_YYYY} style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</Row>
	);
};

export default ProjectsPresentational;
