import React, { useEffect } from 'react';
import { Input, Button, Form, Row, Col, Drawer } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import DatePicker from 'components/date-picker';

const { TextArea } = Input;

const AddVoucherHead = ({ voucherHeadModal, setVoucherHeadModal, editVoucherHead, handleClose, refreshList, width = '40%' }) => {
	const [form] = Form.useForm();
	const dispatch = useDispatch();
	const globalRedux = useSelector((state) => state.globalRedux);

	useEffect(() => {
		if (editVoucherHead) {
			form.setFieldsValue({
				voucherheadName: editVoucherHead?.voucherheadName,
				openingBalance: editVoucherHead?.openingBalance || 0,
				openingDate: editVoucherHead?.openingDate ? moment(editVoucherHead?.openingDate) : null,
				remarks: editVoucherHead?.remarks,
			});
		} else {
			form.resetFields();
		}
	}, [editVoucherHead, form]);

	const handleSubmit = (values) => {
		const payload = {
			...values,
			openingDate: values?.openingDate?.format('YYYY-MM-DD'),
			orgId: globalRedux?.selectedOrganization?.id,
		};

		if (!editVoucherHead) {
			dispatch(postApi(payload, 'ADD_VOUCHER_HEAD'));
		} else {
			const url = `${SERVER_IP}voucherhead/${editVoucherHead._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
			dispatch(putApi(payload, 'EDIT_VOUCHER_HEAD', url));
		}
	};

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_VOUCHER_HEAD === 'SUCCESS' || globalRedux.apiStatus.EDIT_VOUCHER_HEAD === 'SUCCESS') {
			dispatch(resetApiStatus(editVoucherHead ? 'EDIT_VOUCHER_HEAD' : 'ADD_VOUCHER_HEAD'));
			refreshList?.();
			handleClose?.();
			setVoucherHeadModal(false);
			form.resetFields();
		}
	}, [globalRedux.apiStatus, dispatch, editVoucherHead, form, handleClose, refreshList, setVoucherHeadModal]);

	const layer1FormCol = {
		labelCol: { span: 12 },
		wrapperCol: { span: 12 },
	};

	const loading = globalRedux.apiStatus.ADD_VOUCHER_HEAD === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_VOUCHER_HEAD === API_STATUS.PENDING;

	return (
		<Drawer placement="right" title={`${editVoucherHead ? 'Edit' : 'New'} Voucher Head`} width={width} open={voucherHeadModal} closable onClose={() => setVoucherHeadModal(false)} destroyOnHidden>
			<Row>
				<Col span={24}>
					<Form form={form} name="voucher-head-form" onFinish={handleSubmit} colon={false} requiredMark={false} labelAlign="left" style={{ width: '100%' }} {...layer1FormCol}>
						<Form.Item label="Voucher Name" name="voucherheadName" rules={[{ required: true, message: 'This field is required!' }]}>
							<Input placeholder="Enter voucher name" />
						</Form.Item>

						<Form.Item label="Opening Balance" name="openingBalance">
							<Input type="number" placeholder="Enter opening balance" />
						</Form.Item>

						<Form.Item label="Opening Date" name="openingDate" rules={[{ required: true, message: 'This field is required!' }]}>
							<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
						</Form.Item>

						<Form.Item label="Remarks" name="remarks">
							<TextArea placeholder="Enter remarks" />
						</Form.Item>

						<Form.Item wrapperCol={{ span: 24 }}>
							<Row gutter={10} style={{ paddingTop: 20 }}>
								<Col span={12}>
									<Button danger onClick={() => setVoucherHeadModal(false)} style={{ width: '100%' }}>
										Cancel
									</Button>
								</Col>
								<Col span={12}>
									<Button loading={loading} type="primary" htmlType="submit" style={{ width: '100%' }}>
										{editVoucherHead ? 'Update' : 'Save'}
									</Button>
								</Col>
							</Row>
						</Form.Item>
					</Form>
				</Col>
			</Row>
		</Drawer>
	);
};

export default AddVoucherHead;
