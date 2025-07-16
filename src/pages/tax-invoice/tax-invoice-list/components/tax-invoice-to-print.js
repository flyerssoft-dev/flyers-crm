import React, { forwardRef } from 'react';
import './tax-invoice-to-print.scss';

const InvoiceToPrint = forwardRef((props, ref) => {
	return (
		<div className="invoice-pdf-container" ref={ref}>
			<div style={{ fontWeight: 'bold', textAlign: 'center' }}>TAX INVOICE</div>
			<table cellPadding="0" cellSpacing="0">
				<tbody>
					<tr>
						<td colSpan="3">
							<table border="1" className="top-heading">
								<tbody>
									{/* Company and Invoice Info */}
									<tr>
										<td rowSpan="3" style={{ width: '50%' }}>
											<div className="content">
												<div className="title">MEGA DISH ANTENNA & SATELLITE SYSTEM</div>
												<div>G6 Ajantha Lodge Building</div>
												<div>Opp. Abirami Theatre Road, 61, Mettur Road</div>
												<div>Erode: 638 011</div>
												<div className="mobile">Mobile: 8012941249</div>
												<div className="gst">GST: 33AUUIYER789SS</div>
											</div>
										</td>
										<td className="value_container">
											<div>Invoice No:</div>
											<div className="value">120380912</div>
										</td>
										<td rowSpan="3">
											<div>Voucher</div>
										</td>
									</tr>
									<tr>
										<td className="value_container">
											<div>Date:</div>
											<div className="value">20/12/2022</div>
										</td>
									</tr>
									<tr>
										<td className="value_container">
											<div>Mode of Payment:</div>
											<div className="value">CREDIT BILL</div>
										</td>
									</tr>

									{/* Buyer Details */}
									<tr>
										<td rowSpan="3">
											<div className="content">
												<div className="title">Buyer:</div>
												<div className="title">YUVA TECHNOLOGIES</div>
												<div>G6 Ajantha Lodge Building</div>
												<div>Opp. Abirami Theatre Road, 61, Mettur Road</div>
												<div>Erode: 638 011</div>
												<div className="mobile">Mobile: 8012941249</div>
												<div className="gst">GST: 33AUUIYER789SS</div>
											</div>
										</td>
										<td colSpan="2" className="value_container">
											<div>Dispatched Through:</div>
											<div className="value"></div>
										</td>
									</tr>
									<tr>
										<td colSpan="2" className="value_container">
											<div>Terms of Conditions:</div>
											<div className="value"></div>
										</td>
									</tr>
									<tr>
										<td colSpan="2" className="value_container">
											<div>Other Reference(s):</div>
											<div className="value"></div>
										</td>
									</tr>

									{/* IRN/Ack */}
									<tr>
										<td colSpan="3">
											<div className="content">
												<div className="title">
													IRN: <span style={{ fontWeight: 'normal' }}>33AUUIYER789SS</span>
												</div>
												<div style={{ display: 'flex' }}>
													<div className="title" style={{ width: '50%' }}>
														Ack Date: <span style={{ fontWeight: 'normal' }}>20/12/2022</span>
													</div>
													<div className="title" style={{ width: '50%' }}>
														Ack No: <span style={{ fontWeight: 'normal' }}>ACK123456</span>
													</div>
												</div>
											</div>
										</td>
									</tr>

									{/* Items Table */}
									<tr>
										<td colSpan="3" style={{ padding: 0 }}>
											<table width="100%" border="1">
												<thead>
													<tr>
														<th>S.No</th>
														<th>Description</th>
														<th>HSNCode</th>
														<th>Quantity</th>
														<th>Rate</th>
														<th>GST%</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													{Array(7)
														.fill('')
														.map((_, index) => (
															<tr key={index}>
																<td style={{ textAlign: 'center' }}>{index + 1}</td>
																<td>Mouse Logitech wireless</td>
																<td style={{ textAlign: 'center' }}>SD34589</td>
																<td style={{ textAlign: 'center' }}>2</td>
																<td style={{ textAlign: 'center' }}>100.00</td>
																<td style={{ textAlign: 'center' }}>20.00</td>
																<td style={{ textAlign: 'center' }}>120.00</td>
															</tr>
														))}
												</tbody>
											</table>
										</td>
									</tr>

									{/* Tax Summary */}
									<tr>
										<td style={{ width: '50%', padding: 0 }}>
											<table className="tax-table" style={{ borderWidth: 0 }} width="100%">
												<thead>
													<tr>
														<th rowSpan="2">Taxable Value</th>
														<th colSpan="2">CGST</th>
														<th colSpan="2">SGST</th>
													</tr>
													<tr>
														<th>%</th>
														<th>Amount</th>
														<th>%</th>
														<th>Amount</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td>8224.48</td>
														<td>9.00</td>
														<td>724.24</td>
														<td>9.00</td>
														<td>724.20</td>
													</tr>
												</tbody>
											</table>
										</td>
										<td colSpan="2" style={{ width: '50%', padding: 0 }}>
											<table width="100%">
												<tbody>
													<tr>
														<td style={{ textAlign: 'right' }}>
															<div>Gross Amount</div>
															<div>CGST</div>
															<div>SGST</div>
															<div>Round off</div>
														</td>
														<td style={{ textAlign: 'right' }}>
															<div>8,224.48</div>
															<div>724.24</div>
															<div>724.20</div>
															<div>-0.30</div>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>

									{/* Total and Amount in Words */}
									<tr>
										<td>
											<div className="title" style={{ textAlign: 'right' }}>
												Total
											</div>
										</td>
										<td colSpan="2">
											<div className="title" style={{ textAlign: 'right' }}>
												9,560.00
											</div>
										</td>
									</tr>
									<tr>
										<td colSpan="3">
											<div>Amount Chargeable (in words)</div>
											<div className="title">Nine thousand seven hundred and five only</div>
										</td>
									</tr>

									{/* Declarations & Bank Details */}
									<tr>
										<td>
											<div className="content">
												<div>Declaration:</div>
												<ol className="declaration-list">
													<li>Good once sold will not be taken back.</li>
													<li>Warranty for goods is by Manufacturer only.</li>
													<li>No warranty for broken/burnt items.</li>
												</ol>
											</div>
										</td>
										<td colSpan="2">
											<div className="content">
												<div>Company Bank Details:</div>
												<div>Bank: Karur Vysya Bank</div>
												<div>A/C No: 1610 1234 0000 6441</div>
												<div>Branch: Permanallur</div>
												<div>IFSC Code: KVB001231</div>
											</div>
										</td>
									</tr>

									{/* Signatures */}
									<tr>
										<td>
											<div>Customer's Seal and Signature</div>
										</td>
										<td colSpan="2">
											<div className="title">FOR MEGA DISH ANTENNA & SATELLITE SYSTEM</div>
											<ul className="sign-list">
												<li>Prepared By</li>
												<li>Verified By</li>
												<li>Authorised Signatory</li>
											</ul>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
});

export default InvoiceToPrint;
