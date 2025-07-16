import React, { forwardRef } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { DATE_FORMAT } from 'constants/app-constants';

const VoucherToPrint = forwardRef(({ data }, ref) => {
	const { firstName = '', lastName = '' } = useSelector((state) => state?.loginRedux || {});
	const {
		voucherNumber = '-',
		voucherDate = null,
		amount = '-',
		voucherheadId = {}
	} = data || {}; // ✅ Safe fallback to {} when data is null

	const voucherheadName = voucherheadId?.voucherheadName || '-';

	return (
		<div className="voucher-box" ref={ref}>
			<table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
				<tbody>
					<tr className="top">
						<td colSpan="3">
							<table className="bordered-bottom" style={{ width: '100%' }}>
								<tbody>
									<tr>
										<td className="title">
											<div>Voucher</div>
											<div>R K V Matriculation Higher Secondary School, Jedarpalayam</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>

					<tr className="information">
						<td colSpan="3">
							<table className="bordered-bottom" style={{ width: '100%' }}>
								<tbody>
									<tr>
										<td>
											<div className="row">
												<div className="label">Voucher No#:</div>
												<div className="value">{voucherNumber}</div>
											</div>
											<div className="row">
												<div className="label">Voucher Date:</div>
												<div className="value">
													{voucherDate ? moment(voucherDate).format(DATE_FORMAT.DD_MM_YYYY) : '-'}
												</div>
											</div>
										</td>
										<td />
										<td>
											<div className="row">
												<div className="label" style={{ width: '52%' }}>Printed On:</div>
												<div className="value" style={{ width: '48%' }}>
													{moment().format(`${DATE_FORMAT.DD_MM_YYYY}, h:mm A`)}
												</div>
											</div>
											<div className="row">
												<div className="label" style={{ width: '52%' }}>Voucher By:</div>
												<div className="value" style={{ width: '48%' }}>
													{`${firstName} ${lastName}`.trim() || '-'}
												</div>
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>

					<tr className="heading">
						<td width="60%">Particulars</td>
						<td width="40%">Amount</td>
					</tr>

					<tr className="item">
						<td>{voucherheadName}</td>
						<td>{amount}</td>
					</tr>

					<tr className="total">
						<td />
						<td>Total: {amount}</td>
					</tr>
				</tbody>
			</table>

			<div className="voucher-footer">
				<div className="voucher-footer-left">Authorized Signature</div>
				<div className="voucher-footer-right">Receiver's Signature</div>
			</div>
		</div>
	);
});

export default VoucherToPrint;
