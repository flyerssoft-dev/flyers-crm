import React, { forwardRef } from 'react';
import moment from 'moment';
import { DATE_FORMAT } from 'constants/app-constants';
import { useSelector } from 'react-redux';

const ComponentToPrint = forwardRef((props, ref) => {
	const { firstName = '', lastName = '' } = useSelector((state) => state?.loginRedux);
	const { studentId: { admissionNumber, studentName, section, primaryMobile, classId: { className } = {} } = {}, receiptNumber, receiptDate, receiptDetails } = props?.data || {};

	return (
		<div className="invoice-box" ref={ref}>
			<table cellPadding="0" cellSpacing="0">
				<thead>
					<tr className="top">
						<td colSpan="2" style={{ padding: 0, paddingTop: 20 }}>
							<table className="bordered-bottom">
								<tbody>
									<tr>
										<td className="title">
											<div>Fees Receipt</div>
											<div>R K V Matriculation Higher Secondary School, Jedarpalayam</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</thead>

				<tbody>
					<tr className="information">
						<td colSpan="2">
							<table className="bordered-bottom">
								<tbody>
									<tr>
										<td>
											<div className="row">
												<div className="label">Admission No:</div>
												<div className="value">{admissionNumber}</div>
											</div>
											<div className="row">
												<div className="label">Student Name:</div>
												<div className="value">{studentName}</div>
											</div>
											<div className="row">
												<div className="label">Class:</div>
												<div className="value">{`${className} - ${section}`}</div>
											</div>
											<div className="row">
												<div className="label">Contact No:</div>
												<div className="value">{primaryMobile}</div>
											</div>
										</td>
										<td className="no_padding">
											<div className="row">
												<div className="label">Receipt No#:</div>
												<div className="value">{receiptNumber || ''}</div>
											</div>
											<div className="row">
												<div className="label">Receipt Date:</div>
												<div className="value">{moment(receiptDate).format(DATE_FORMAT.DD_MM_YYYY) || ''}</div>
											</div>
											<div className="row">
												<div className="label">Printed On:</div>
												<div className="value">{moment().format(`${DATE_FORMAT.DD_MM_YYYY}, h:mm A`) || ''}</div>
											</div>
											<div className="row">
												<div className="label">Receipt By:</div>
												<div className="value">{`${firstName} ${lastName}`}</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>

					<tr className="heading">
						<td>Particulars</td>
						<td>Amount</td>
					</tr>

					{receiptDetails?.map((data, idx) => (
						<tr className="item" key={idx}>
							<td>{data?.categoryId?.categoryName}</td>
							<td>{data?.amount}</td>
						</tr>
					))}

					<tr className="total">
						<td></td>
						<td>Total: {receiptDetails?.reduce((acc, item) => acc + item.amount, 0)}</td>
					</tr>
				</tbody>
			</table>

			<div className="invoice-footer">
				<div className="invoice-footer-left">Payer's Signature</div>
				<div className="invoice-footer-right">Authorized Signature</div>
			</div>
		</div>
	);
});

export default ComponentToPrint;
