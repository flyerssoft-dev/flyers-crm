import React from 'react';
import moment from 'moment';
import { Row, Col, Select, Button } from 'antd';
import TableComponent from 'components/table-component';
import { DATE_FORMAT } from 'constants/app-constants';
import DatePicker from 'components/date-picker';

const { Option } = Select;

const CustomerStatementListPresentational = ({ filteredData, tableLoading, customers, handleFilterOptions, columns, fetchCustomerStatements, filterOptions, tableData, setPreviewModalVisible }) => {
	return (
		<Row style={{ margin: '20px' }}>
			<Col span={20}>
				<div className="customer-statement-container">
					<div className="filter-section">
						<Row gutter={[24, 16]}>
							<Col xl={6} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>Customer</label>
									<Select
										showSearch
										placeholder="Select Customer"
										optionFilterProp="children"
										className="input"
										filterOption={(input, option) => option?.children?.toLowerCase()?.includes(input.toLowerCase())}
										onChange={(value) => handleFilterOptions('customerId', value)}>
										{customers?.map((customer) => (
											<Option key={customer._id} value={customer._id}>
												{customer?.displayName}
											</Option>
										))}
									</Select>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>From Date</label>
									<DatePicker
										allowClear={false}
										className="input"
										placeholder="From Date"
										format={DATE_FORMAT.DD_MM_YYYY}
										onChange={(date) => handleFilterOptions('fromDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')}
										value={filterOptions?.fromDate ? moment(filterOptions.fromDate) : null}
									/>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>To Date</label>
									<DatePicker
										allowClear={false}
										className="input"
										placeholder="To Date"
										format={DATE_FORMAT.DD_MM_YYYY}
										onChange={(date) => handleFilterOptions('toDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')}
										value={filterOptions?.toDate ? moment(filterOptions.toDate) : null}
									/>
								</div>
							</Col>
							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label style={{ opacity: 0 }}>Action</label>
									<Button onClick={fetchCustomerStatements} type="primary">
										Refresh
									</Button>
								</div>
							</Col>
							{filterOptions?.customerId && (
								<Col xl={4} md={6} sm={12} xs={24}>
									<div className="fieldGroup">
										<label style={{ opacity: 0 }}>Action</label>
										<Button onClick={() => setPreviewModalVisible(true)} type="primary">
											Print
										</Button>
									</div>
								</Col>
							)}
						</Row>
					</div>

					<div className="balance-summary-equation">
						<div className="summary-box">
							<label>Opening Balance</label>
							<p className="value">₹ {Number(tableData?.openingBalance || 0).toFixed(2)}</p>
						</div>
						<span className="symbol">+</span>
						<div className="summary-box">
							<label>Total Debit Amount</label>
							<p className="value debit">₹ {Number(tableData?.totalDebit || 0).toFixed(2)}</p>
						</div>
						<span className="symbol">−</span>
						<div className="summary-box">
							<label>Total Credit Amount</label>
							<p className="value credit">₹ {Number(tableData?.totalCredit || 0).toFixed(2)}</p>
						</div>
						<span className="symbol">=</span>
						<div className="summary-box">
							<label>Closing Balance</label>
							<p className="value">₹ {Number(tableData?.closingBalance || 0).toFixed(2)}</p>
						</div>
					</div>

					<div className="table-section">
						<TableComponent loading={tableLoading} className="custom-table" style={{ width: '100%' }} rowKey={(record) => record._id} dataSource={filteredData} columns={columns} pagination={false} />
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default CustomerStatementListPresentational;
