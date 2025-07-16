import React, { forwardRef } from 'react';
// import moment from 'moment';
// import { useSelector } from 'react-redux';
// import { DATE_FORMAT } from 'constants/app-constants';
import './invoice-to-print.scss';

const InvoiceToPrint = forwardRef((props, ref) => {
	// const { firstName = '', lastName = '' } = useSelector((state) => state?.loginRedux);
	// const { voucherNumber, voucherDate, amount, voucherheadId: { voucherheadName } = {} } = props?.data || {};
	return (
		<div className="invoice-pdf-container" ref={ref}>
			<div style={{ fontWeight: 'bold', textAlign: 'center' }}>TAX INVOICE</div>
			<table cellPadding="0" cellSpacing="0">
				<tr>
					<td colSpan="3">
						<table border="1" className="top-heading">
							<tr>
								<td rowSpan={'3'} style={{ width: '50%' }}>
									<div className="content">
										<div className="title">MEGA DISH ANTENNA & SATELLITE SYSTEM</div>
										<div>G6 Ajantha Lodge Building</div>
										<div>Opp. Abirami Theatre Road, 61, Mettur Road</div>
										<div>Erode: 638 011</div>
										<div className="mobile">Mobile: 8012941249</div>
										<div className="gst">GST: 33AUUIYER789SS</div>
									</div>
								</td>
								<td style={{ width: '25%' }} className="value_container">
									<div>Invoice No:</div>
									<div className="value">120380912</div>
								</td>
								<td rowSpan={'3'} style={{ width: '25%' }}>
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
							<tr>
								<td rowSpan={'3'} style={{ width: '50%' }}>
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
								<td colSpan="2" style={{ width: '25%' }} className="value_container">
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
							<tr>
								<td colSpan={'3'} style={{ width: '50%' }}>
									<div className="content">
										<div className="title">
											IRN: <span style={{ fontWeight: 'normal' }}>33AUUIYER789SS</span>
										</div>
										<div style={{ display: 'flex' }}>
											<div className="title" style={{ width: '50%' }}>
												Ack Date: <span style={{ fontWeight: 'normal' }}>33AUUIYER789SS</span>
											</div>
											<div className="title" style={{ width: '50%' }}>
												Ack Date: <span style={{ fontWeight: 'normal' }}>33AUUIYER789SS</span>
											</div>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan="3" style={{ padding: 0 }}>
									<table>
										<tr>
											<td
												style={{
													fontWeight: 'bold',
													borderTopWidth: 0,
													borderBottomWidth: 1,
													borderLeftWidth: 0,
													textAlign: 'center',
												}}>
												S.No
											</td>
											<td style={{ fontWeight: 'bold', borderTopWidth: 0, borderBottomWidth: 1, padding: 5 }}>Description</td>
											<td style={{ fontWeight: 'bold', borderTopWidth: 0, borderBottomWidth: 1, textAlign: 'center' }}>
												HSNCode
											</td>
											<td style={{ fontWeight: 'bold', borderTopWidth: 0, borderBottomWidth: 1, textAlign: 'center' }}>
												Quantity
											</td>
											<td style={{ fontWeight: 'bold', borderTopWidth: 0, borderBottomWidth: 1, textAlign: 'center' }}>Rate</td>
											<td style={{ fontWeight: 'bold', borderTopWidth: 0, borderBottomWidth: 1, textAlign: 'center' }}>GST%</td>
											<td
												style={{
													fontWeight: 'bold',
													borderTopWidth: 0,
													borderBottomWidth: 1,
													borderRightWidth: 0,
													textAlign: 'center',
												}}>
												Amount
											</td>
										</tr>
										{Array(7)
											.fill('')
											.map((data, index) => (
												<tr>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															borderLeftWidth: 0,
															textAlign: 'center',
															height: 30,
														}}>
														{index + 1}
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															padding: 5,
															height: 30,
														}}>
														Mouse Logitech wireless
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															textAlign: 'center',
															height: 30,
														}}>
														SD34589
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															textAlign: 'center',
															height: 30,
														}}>
														2
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															textAlign: 'center',
															height: 30,
														}}>
														100.00
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															textAlign: 'center',
															height: 30,
														}}>
														20.00
													</td>
													<td
														style={{
															borderTopWidth: 0,
															borderBottomWidth: 0,
															// borderBottomWidth: index + 1 === 10 ? 0 : 1,
															borderRightWidth: 0,
															textAlign: 'center',
															height: 30,
														}}>
														120.00
													</td>
												</tr>
											))}
									</table>
								</td>
							</tr>
							<tr>
								<td style={{ width: '50%', padding: 0 }}>
									<table style={{ borderWidth: 0, minHeight: 150 }} className="tax-table">
										<tr>
											<td rowSpan="2" style={{ borderWidth: 0 }}>
												Taxable Value
											</td>
											<td colSpan="2" style={{ borderTopWidth: 0 }}>
												CGST
											</td>
											<td colSpan="2" style={{ borderWidth: 0 }}>
												SGST
											</td>
										</tr>
										<tr>
											<td>%</td>
											<td>Amount</td>
											<td>%</td>
											<td style={{ borderRightWidth: 0 }}>Amount</td>
										</tr>
										<tr style={{ height: 90 }}>
											<td style={{ borderLeftWidth: 0, borderBottomWidth: 0 }}>8224.48</td>
											<td style={{ borderBottomWidth: 0 }}>9.00</td>
											<td style={{ borderBottomWidth: 0 }}>724.24</td>
											<td style={{ borderBottomWidth: 0 }}>9.00</td>
											<td style={{ borderRightWidth: 0, borderBottomWidth: 0 }}>724.20</td>
										</tr>
									</table>
								</td>
								<td colSpan={'2'} style={{ width: '50%', padding: 0 }}>
									<table>
										<tr>
											<td style={{ borderLeftWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
												<div style={{ paddingRight: 5 }}>
													<div style={{ minHeight: 135, textAlign: 'right' }}>
														<div>Gross Amount</div>
														<div>CGST</div>
														<div>SGST</div>
													</div>
													<div style={{ textAlign: 'right' }}>Round off</div>
												</div>
											</td>
											<td style={{ borderRightWidth: 0, borderTopWidth: 0, borderBottomWidth: 0 }}>
												<div style={{ paddingRight: 5 }}>
													<div style={{ minHeight: 135, textAlign: 'right' }}>
														<div>8,224.48</div>
														<div>724.24</div>
														<div>724.20</div>
													</div>
													<div style={{ textAlign: 'right' }}>-0.30</div>
												</div>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td style={{ width: '50%' }}>
									<div className="content">
										<div className="title" style={{ textAlign: 'right' }}>
											Total
										</div>
									</div>
								</td>
								<td colSpan={'2'} style={{ width: '50%' }}>
									<div className="content">
										<div className="title" style={{ textAlign: 'right' }}>
											9,560.00
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td colSpan={'3'} style={{ width: '50%' }}>
									<div className="content">
										<div>Amount Chargeable (in words)</div>
										<div className="title" style={{ width: '50%' }}>
											Nine thousand seven hundred and five only
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td style={{ width: '50%' }}>
									<div className="content">
										<div>Declaration:</div>
										<div style={{ display: 'flex', paddingTop: 10 }}>
											<div style={{ width: '70%' }}>
												<ol className="declaration-list">
													<li>Good one sold out wont be taken back.</li>
													<li>The warranty for goods supplied is given by Manufracturer only.</li>
													<li>No warranty for broken, burnt.</li>
												</ol>
											</div>
											<div style={{ width: '30%' }} className="value">
												Karur Vysya Bank
											</div>
										</div>
									</div>
								</td>
								<td colSpan="2" style={{ width: '50%' }}>
									<div className="content">
										<div>Company bank details:</div>
										<div style={{ display: 'flex', paddingTop: 10 }}>
											<div style={{ width: '50%' }}>Bank Name:</div>{' '}
											<div style={{ width: '50%' }} className="value">
												Karur Vysya Bank
											</div>
										</div>
										<div style={{ display: 'flex' }}>
											<div style={{ width: '50%' }}>A/C No:</div>{' '}
											<div style={{ width: '50%' }} className="value">
												1610 1234 0000 6441
											</div>
										</div>
										<div style={{ display: 'flex' }}>
											<div style={{ width: '50%' }}>Branch:</div>
											<div style={{ width: '50%' }} className="value">
												Permanallur
											</div>
										</div>
										<div style={{ display: 'flex' }}>
											<div style={{ width: '50%' }}>IFSC Code:</div>{' '}
											<div style={{ width: '50%' }} className="value">
												KVB001231
											</div>
										</div>
									</div>
								</td>
							</tr>
							<tr>
								<td style={{ width: '50%' }}>
									<div className="content" style={{ height: 70 }}>
										<div>Customer's Seal and Signature</div>
									</div>
								</td>
								<td colSpan="2" style={{ width: '50%' }}>
									<div className="content">
										<div className="title">FOR MEGA DISH ANTENNA & SATELLITE SYSTEM</div>
										<ul className="sign-list">
											<li>Prepare By</li>
											<li>Verified By</li>
											<li>Autherised Signatory</li>
										</ul>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</div>
	);
});

export default InvoiceToPrint;
