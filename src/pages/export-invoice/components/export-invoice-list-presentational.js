import React from 'react';
import moment from 'moment';
import { Row, Col, Select, Button } from 'antd';
import DatePicker from 'components/date-picker';
import { DATE_FORMAT } from 'constants/app-constants';

const { Option } = Select;

const ExportInvoiceListPresentational = ({ customers, filterOptions, handleFilterOptions, handlePrintPreview, isPdfValid, handleDownload, handleResetFilters, isLoadingPdf }) => {
	return (
		<Row style={{ margin: '20px' }}>
			<Col span={20}>
				<div className="customer-statement-container">
					<div className="filter-section">
						<Row gutter={[10, 16]}>
							<Col xl={6} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>Customer</label>
									<Select showSearch placeholder="Select Customer" optionFilterProp="children" className="input" value={filterOptions.customerId} onChange={(value) => handleFilterOptions('customerId', value)}>
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
										className="input"
										format={DATE_FORMAT.DD_MM_YYYY}
										allowClear={false}
										value={moment(filterOptions.fromDate)}
										onChange={(date) => handleFilterOptions('fromDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')}
									/>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>To Date</label>
									<DatePicker
										className="input"
										format={DATE_FORMAT.DD_MM_YYYY}
										allowClear={false}
										value={moment(filterOptions.toDate)}
										onChange={(date) => handleFilterOptions('toDate', date ? date.format(DATE_FORMAT.YYYY_MM_DD) : '')}
									/>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>Invoice Type</label>
									<Select className="input" value={filterOptions.invoiceType} onChange={(val) => handleFilterOptions('invoiceType', val)}>
										<Option value="tax_invoice">Tax Invoice</Option>
										<Option value="proforma_invoice">Proforma Invoice</Option>
									</Select>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<label>Copy Type</label>
									<Select className="input" value={filterOptions.copyType} onChange={(val) => handleFilterOptions('copyType', val)}>
										<Option value="Original">Original</Option>
										<Option value="Duplicate">Duplicate</Option>
										<Option value="Triplicate">Triplicate</Option>
									</Select>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<Button type="primary" onClick={handlePrintPreview} loading={isLoadingPdf} disabled={isLoadingPdf}>
										{isLoadingPdf ? 'Generating PDF...' : 'Preview PDF'}
									</Button>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<Button type="primary" disabled={!isPdfValid} onClick={handleDownload}>
										Download PDF
									</Button>
								</div>
							</Col>

							<Col xl={4} md={6} sm={12} xs={24}>
								<div className="fieldGroup">
									<Button onClick={handleResetFilters}>Reset</Button>
								</div>
							</Col>
						</Row>
					</div>
				</div>
			</Col>
		</Row>
	);
};

export default ExportInvoiceListPresentational;
