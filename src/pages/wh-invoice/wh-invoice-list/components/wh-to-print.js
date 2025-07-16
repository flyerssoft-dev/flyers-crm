import React, { forwardRef } from 'react';
import moment from 'moment';
import { DATE_FORMAT } from 'constants/app-constants';
import ESign from 'assets/images/eSign.jpeg';

const LabelValue = ({ label, value }) => (
	<div className="label_value">
		<div className="label">{label}</div>
		<div className="colon">:</div>
		<div className="value">{value}</div>
	</div>
);

const WHToPrint = forwardRef((props, ref) => {
	// const { firstName = '', lastName = '' } = useSelector((state) => state?.loginRedux);
	const {
		sgst,
		cgst,
		igst,
		gstin,
		notes,
		subTotal,
		totalAmount,
		amountInWords,
		roundOff,
		poNumber,
		items,
		invoiceNumber,
		billingAddress,
		vendorId,
		invoiceDate,
	} = props?.data || {};

	const printoutType = props?.printoutType;

	return (
		<div class="invoice-pdf" ref={ref}>
			<div className="invoice-pdf-container">
				<table cellPadding="0" cellSpacing="0">
					<tr class="top">
						<td colSpan="6" style={{ padding: 0, paddingTop: 0 }}>
							<table className="bordered-bottom">
								<tr>
									<td class="title">
										<div className="left">
											{/* <div className="image">
											<img src="https://png2.cleanpng.com/sh/61554d2de5d6be188f3141549aa288ee/L0KzQYm3VsMxN5Rtj5H0aYP2gLBuTgRpcaN6e9pubnT4gn70lgJ2b5JzReZubYDvdX77iPlzfaF1eeRqbXv4fsPojb1ufaN6RadrM0e8QLO3VchibpI6RqgCNUK6RIqBUcU0OGQ7UKMCNkO5Q4S1kP5o/kisspng-thiruchendur-murugan-temple-thirupparamkunram-muru-5b3790b058afa5.6752749815303681763633.png" />
										</div> */}
											<div className="content">
												<div className="name" style={{ color:'#000'}}>THIRUCHANDUR MURUGAN THUNAI</div>
												{/* <div>LORRY TRANSPORTS</div> */}
												<div className="address">36/71, Vivekanantha Nagar, Thekkupalayam Post, </div>
												<div className="address">Coimbatore - 641620.</div>
												<div className="contact">
													<span>Email: tmttransportcbe@gmail.com</span>
													<div>Contact: 9442294566</div>
													<div>www.tmttransport.in</div>
													<div>GSTIN : 33BCGPS9280R2ZL</div>
												</div>
											</div>
										</div>
										<div className="right">
											<div className="content">
												<div className="tax-invoice">TAX INVOICE</div>
												<div className="copy">({printoutType} Copy)</div>
											</div>
											{/* <div>GSTIN : 33BCGPS9280R2ZL</div>
										<div>Mobile : 9442294566</div> */}
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr class="information">
						<td colSpan="6">
							<table className="bordered-bottom">
								<tr>
									<td style={{ width: '50%' }}>
										<div className="toArea">
											<p>To:</p>
											<div className="details">
												<div style={{ width: '100%' }}>{vendorId?.vendorName}</div>
												<div style={{ width: '100%' }}>{billingAddress}</div>
												{/* <div>SURVEY NO-950 ROYAKOTTAI ROAD,</div>
												<div>HOSUR - 635109</div> */}
												<div>{`GSTIN : ${gstin || ''}`}</div>
												{/* <div>{`PAN NO: BCGPS9280R`}</div> */}
											</div>
										</div>
									</td>
									<td />
									<td className="no_padding">
										<div style={{ paddingTop: 20, fontSize: 14 }}>
											<div className="row">
												<div className="label">Bill No:</div>
												<div className="value">{invoiceNumber}</div>
											</div>
											<div className="row">
												<div className="label">Date:</div>
												<div className="value">{moment(invoiceDate).format(`${DATE_FORMAT.DD_MM_YYYY}`) || ''}</div>
											</div>
											<div className="row">
												<div className="label">PO No:</div>
												<div className="value">{poNumber}</div>
											</div>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr class="heading custom-heading">
						<td>S.No</td>
						<td>SAC NO</td>
						<td>LR No</td>
						<td>QTY IN KGS</td>
						<td>RATE PER KG</td>
						<td>Value in Rs.</td>
					</tr>

					{items?.map((data, index) => (
						<tr class="item custom-item">
							<td>{index + 1}</td>
							<td>{data?.hsnSac}</td>
							<td>{data?.lrNumber}</td>
							<td>{data?.kgs || 0}</td>
							<td>{parseFloat(data?.rate || 0).toFixed(2)}</td>
							<td>{parseFloat(data?.totalAmount || 0).toFixed(2)}</td>
						</tr>
					))}
					{/* <tr class="total">
					<td></td>
					<td>Total: {receiptDetails?.reduce((acc, item) => acc + item.amount, 0)}</td>
				</tr> */}
				</table>
				<div class="invoice-footer">
					{/* <div class="invoice-footer-left">Payer's Signature</div>
					<div class="invoice-footer-right">Authorized Signature</div> */}
					<div style={{ fontSize: 14, width: '100%' }} className="amount_gst_area">
						<div className="amount_area">
							<div className="amount_area_container" style={{ lineHeight: 'normal', height: '100%' }}>
								<div>
									<div className="bold" style={{ paddingRight: 10 }}>
										Amount in words
									</div>
									<div>{amountInWords}</div>
								</div>
								<div>
									<div className="bold" style={{ paddingRight: 10 }}>
										Notes:
									</div>
									<div>{notes}</div>
								</div>
							</div>
						</div>
						<div className="gst_area">
							<LabelValue {...{ label: 'Sub Total', value: parseFloat(subTotal).toFixed(2) }} />
							<LabelValue {...{ label: `SGST ${props?.data?.gstRate / 2}%`, value: sgst }} />
							<LabelValue {...{ label: `CGST ${props?.data?.gstRate / 2}%`, value: cgst }} />
							<LabelValue {...{ label: `IGST ${props?.data?.gstRate}%`, value: igst }} />
							<LabelValue {...{ label: 'Round Off (+/-)', value: roundOff }} />
							<LabelValue {...{ label: 'Grand Total', value: parseFloat(totalAmount).toFixed(2) }} />
						</div>
					</div>
				</div>
				<div className="signArea">
					<div className="left">
						<span className="title">Document Enclosed</span>
						<div className="paragraph">
							<div>1. All payments to be made by crossed Cheque/DD in favour of the THIRUCHANDUR MURUGAN THUNAI</div>
							<div>
								2. Interest will be charged at 18% per annum on outstanding after one week from the date of this bill until
								realisation
							</div>
						</div>
					</div>
					<div className="sign">
						<span style={{ color:'#000'}}>For THIRUCHANDUR MURUGAN THUNAI</span>
						<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							<img src={ESign} alt="e-sign" style={{}} height="80px" width="80px" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

export default WHToPrint;
