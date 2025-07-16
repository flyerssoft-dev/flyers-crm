import React from 'react';
import { Button, Select, Typography, Space, Row, Col, Tooltip, Divider } from 'antd';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT } from 'constants/app-constants';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

const ExportGstJsonListPresentational = ({
	isLoading,
	selectedGstType,
	onGstTypeChange,
	onDownload,
	filterOptions,
	handleFilterOptions,
	onApplyPreset,
}) => {
	const fromDate = moment(filterOptions.fromDate);
	const toDate = moment(filterOptions.toDate);

	return (
		<div style={{ maxWidth: 700, padding: '24px 32px' }}>
			<Title level={4} style={{ marginBottom: 24, color: '#1a1a1a' }}>
				GST JSON Export
			</Title>

			<Space direction="vertical" size="large" style={{ width: '100%' }}>
				{/* GST Type */}
				<Row gutter={16} align="middle">
					<Col span={6}>
						<Text strong>GST Type</Text>
					</Col>
					<Col span={10}>
						<Select
							value={selectedGstType}
							onChange={onGstTypeChange}
							disabled={isLoading}
							style={{ width: '100%' }}
							size="large"
						>
							<Option value="gstr1">GSTR-1</Option>
						</Select>
					</Col>
				</Row>

				{/* From Date */}
				<Row gutter={16} align="middle">
					<Col span={6}>
						<Text strong>
							From Date{' '}
							<Tooltip title="Select the start date for export">
								<InfoCircleOutlined style={{ color: '#4096ff' }} />
							</Tooltip>
						</Text>
					</Col>
					<Col span={10}>
						<DatePicker
							className="input"
							suffixIcon={<CalendarOutlined />}
							format={DATE_FORMAT.DD_MM_YYYY}
							allowClear={false}
							size="large"
							value={fromDate}
							onChange={(date) =>
								handleFilterOptions('fromDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')
							}
							disabledDate={(current) =>
								current &&
								(current > moment().endOf('day') || (toDate && current.isAfter(toDate, 'day')))
							}
							style={{ width: '100%' }}
						/>
					</Col>
				</Row>

				{/* To Date */}
				<Row gutter={16} align="middle">
					<Col span={6}>
						<Text strong>
							To Date{' '}
							<Tooltip title="Select the end date for export">
								<InfoCircleOutlined style={{ color: '#4096ff' }} />
							</Tooltip>
						</Text>
					</Col>
					<Col span={10}>
						<DatePicker
							className="input"
							suffixIcon={<CalendarOutlined />}
							format={DATE_FORMAT.DD_MM_YYYY}
							allowClear={false}
							size="large"
							value={toDate}
							onChange={(date) =>
								handleFilterOptions('toDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')
							}
							disabledDate={(current) =>
								current &&
								(current > moment().endOf('day') || (fromDate && current.isBefore(fromDate, 'day')))
							}
							style={{ width: '100%' }}
						/>
					</Col>
				</Row>

				<Divider style={{ margin: '16px 0' }} />

				{/* Presets */}
				<Row>
					<Col span={16} offset={6}>
						<Space wrap size="middle">
							<Button onClick={() => onApplyPreset('this')} size="middle">
								This Month
							</Button>
							<Button onClick={() => onApplyPreset('last')} size="middle">
								Last Month
							</Button>
							<Button onClick={() => onApplyPreset('fiscal')} size="middle">
								Current Fiscal Year
							</Button>
						</Space>
					</Col>
				</Row>

				{/* Download Button */}
				<Row>
					<Col span={16} offset={6}>
						<Button
							type="primary"
							loading={isLoading}
							onClick={onDownload}
						 size="large"
							block
							style={{
								marginTop: 16,
								borderRadius: 8,
								backgroundColor: '#00b472',
								borderColor: '#00b472',
							}}
						>
							{isLoading ? 'Downloading...' : 'Download JSON'}
						</Button>
					</Col>
				</Row>
			</Space>
		</div>
	);
};

export default ExportGstJsonListPresentational;
