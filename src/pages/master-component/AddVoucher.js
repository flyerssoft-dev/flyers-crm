import React, { useCallback, useEffect } from 'react';
import { Input, Button, Divider, Form, Row, Col, Select } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { putApi } from 'redux/sagas/putApiSaga';
import { SERVER_IP } from 'assets/Config';
import { API_STATUS } from 'constants/app-constants';
import DatePicker from 'components/date-picker';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { postApi } from 'redux/sagas/postApiDataSaga';
import { resetApiStatus } from 'redux/reducers/globals/globalActions';

const { TextArea } = Input;

const AddVoucher = ({ handleClose, editVoucher, setAccountBookModal }) => {
	const [form] = Form.useForm();
	const globalRedux = useSelector((state) => state.globalRedux);
	const projects = useSelector((state) => state?.projectRedux?.projects);
	const dispatch = useDispatch();

	const addAccBook = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		dispatch(postApi(data, 'ADD_VOUCHER_HEAD'));
	};

	const handleEdit = (values) => {
		let data = {
			...values,
			orgId: globalRedux?.selectedOrganization?.id,
		};
		let url = `${SERVER_IP}voucherhead/${editVoucher._id}?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(putApi(data, 'EDIT_VOUCHER_HEAD', url));
	};

	const getProjects = useCallback(() => {
		let url = `${SERVER_IP}project/?orgId=${globalRedux?.selectedOrganization?.id}`;
		dispatch(getApi('GET_PROJECTS', url));
	}, [dispatch, globalRedux?.selectedOrganization?.id]);

	useEffect(() => {
		getProjects();
	}, [getProjects]);

	useEffect(() => {
		if (globalRedux.apiStatus.ADD_VOUCHER_HEAD === 'SUCCESS' || globalRedux.apiStatus.EDIT_VOUCHER_HEAD === 'SUCCESS') {
			dispatch(resetApiStatus(editVoucher ? 'EDIT_VOUCHER_HEAD' : 'ADD_VOUCHER_HEAD'));
			setAccountBookModal(false);
			handleClose();
		}
	}, [globalRedux.apiStatus, editVoucher, handleClose, setAccountBookModal, dispatch]);

	const layer1FormCol = {
		labelCol: {
			span: 12,
		},
		wrapperCol: {
			span: 12,
		},
	};

	const loading = globalRedux.apiStatus.ADD_VOUCHER_HEAD === API_STATUS.PENDING || globalRedux.apiStatus.EDIT_VOUCHER_HEAD === API_STATUS.PENDING;

	return (
		<Row>
			<Col span={24}>
				<Row style={{ backgroundColor: '#fff', padding: '10px 0px' }}>
					<Col>
						<h6 style={{ marginBottom: '0px' }}>{editVoucher ? 'Edit' : 'New'} Voucher</h6>
					</Col>
				</Row>
				<Divider />
				<Row style={{ paddingTop: 20 }}>
					<Col span={24}>
						<Form
							name="add-staff"
							style={{}}
							requiredMark={false}
							colon={false}
							labelAlign="left"
							form={form}
							onFinish={!editVoucher ? addAccBook : handleEdit}
							{...layer1FormCol}>
							<Form.Item
								label="Voucher name"
								name="voucherheadName"
								initialValue={editVoucher?.voucherheadName}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<Input placeholder="Voucher name" />
							</Form.Item>
							<Form.Item
								label="Projects"
								name="projectIds"
								initialValue={editVoucher?.projectIds}
								rules={[
									{
										required: false,
										message: 'This Field is required!',
									},
								]}>
								<Select mode="multiple" placeholder="Select Projects">
									{projects.map((project) => (
										<Select.Option key={project._id} value={project._id}>
											{project?.projectName}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label="Opening Balance" name="openingBalance" initialValue={editVoucher?.openingBalance || 0}>
								<Input type="number" placeholder="Account Balance" />
							</Form.Item>
							<Form.Item
								label="Opening Date"
								name="openingDate"
								initialValue={moment(editVoucher?.openingDate)}
								rules={[
									{
										required: true,
										message: 'This Field is Required!',
									},
								]}>
								<DatePicker style={{ width: '100%' }} defaultValue={moment(editVoucher?.openingDate)} format="DD/MM/YYYY" />
							</Form.Item>
							<Form.Item label="Remarks" name="remarks" initialValue={editVoucher?.remarks}>
								<TextArea />
							</Form.Item>
							<Form.Item
								wrapperCol={{
									span: 24,
								}}>
								<Row className="space-between">
									<Button onClick={() => setAccountBookModal(false)} style={{ width: '49%' }} danger>
										Cancel
									</Button>
									<Button loading={loading} type="primary" style={{ width: '49%' }} htmlType="submit">
										Create
									</Button>
								</Row>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</Col>
		</Row>
	);
};

export default AddVoucher;
