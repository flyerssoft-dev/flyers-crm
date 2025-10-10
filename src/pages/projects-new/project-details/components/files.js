import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Row, Col, Upload, Progress, Popconfirm, Table, Modal, Button } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DeleteOutlined, FileImageOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { store } from 'redux/store';
import { SERVER_IP } from 'assets/Config';
import { formQueryStringFromObject } from 'helpers';
import { sendGetRequest } from 'redux/sagas/utils';
import { getDateFormat } from 'services/Utils';
import './files.scss';

const { Dragger } = Upload;

const Files = () => {
	const globalRedux = useSelector((state) => state.globalRedux);
	const [uploadModal, setUploadModal] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadingIndex, setUploadingIndex] = useState(null);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [details, setDetails] = useState({
		loading: false,
		data: null,
	});
	const [fileList, setFileList] = useState([]);
	let { selectedProjectId } = useParams();

	const cancelUploadRef = useRef(); // Ref to hold the cancel token function

	const dummyRequest = ({ onSuccess }) => {
		setTimeout(() => {
			onSuccess('ok');
		}, 0);
	};

	const getData = useCallback(async () => {
		setDetails({
			loading: true,
		});
		const string = formQueryStringFromObject({
			orgId: globalRedux.selectedOrganization._id,
		});
		let url = `${SERVER_IP}project/${selectedProjectId}?${string}`;
		const res = await sendGetRequest(null, url);
		setDetails({
			loading: false,
			data: res.data,
		});
	}, [globalRedux.selectedOrganization._id, selectedProjectId]);

	useEffect(() => {
		getData();
		return () => {
			// Cleanup function to cancel the upload when the component unmounts
			if (cancelUploadRef?.current) {
				cancelUploadRef.current(); // Cancel the upload request
			}
		};
	}, [getData]);

	const props = {
		name: 'file',
		multiple: false,
		action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
		fileList,
		onChange(info) {
			let fileList = [...info.fileList];
			fileList = fileList.slice(-1); // Allow only the last uploaded file
			setFileList(fileList);

			const { status } = info.file;
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
			} else if (status === 'error') {
			}
		},
		onDrop(e) {
			console.log('Dropped files', e.dataTransfer.files);
		},
	};

	const uploadProps = {
		onChange(info) {
			let fileList = [...info.fileList];
			setFileList(fileList);

			const { status } = info.file;
			if (status !== 'uploading') {
				console.log(info.file, info.fileList);
			}
			if (status === 'done') {
			} else if (status === 'error') {
			}
		},
		fileList,
	};

	const uploadFile = async () => {
		try {
			await setUploading(true);
			setUploadProgress(0);

			// Create a cancel token
			const source = axios.CancelToken.source();
			cancelUploadRef.current = source.cancel; // Assign cancel function to cancelUploadRef.current

			// Iterate over each file in the fileList
			for (const file of fileList) {
				const formData = new FormData();
				formData.append('files', file.originFileObj);
				setUploadingIndex(fileList.indexOf(file));

				// Make a separate POST request for each file
				const response = await axios.post(
					`${SERVER_IP}/project/${selectedProjectId}/upload?orgId=${globalRedux?.selectedOrganization?.id}`,
					formData,
					{
						headers: {
							Authorization: store.getState().loginRedux.token,
						},
						onUploadProgress: (progressEvent) => {
							const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
							setUploadProgress(percentCompleted);
						},
						cancelToken: source.token, // Pass the cancel token to the request
					}
				);

				// Handle response for each file individually
				if (response?.data?.message === 'Upload successful') {
					// toast.success(`Upload of "${file.name}" successful`);
				} else {
					toast.error(`Upload of "${file.name}" failed`);
				}
			}

			// After uploading all files, reset state and refresh data
			getData();
		} catch (error) {
			if (axios.isCancel(error)) {
				// Check if the error is due to request cancellation
				console.log('Request canceled', error.message);
			} else {
				toast.error(error?.message || 'Something went wrong!');
			}
		} finally {
			toast.success(`All files uploaded successful`);
			setUploading(false);
			setUploadingIndex(null);
			setFileList([]);
		}
	};

	const handleFileDownload = async (file) => {
		try {
			const link = document.createElement('a');
			link.href = `${SERVER_IP}${file?.path}`;
			link.download = file?.filename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error downloading file:', error);
		}
	};

	const handleDeleteFile = async (file) => {
		try {
			const formData = new FormData();
			formData.append('files', fileList[0]?.originFileObj);
			const response = await axios.delete(`${SERVER_IP}/project/${selectedProjectId}/upload?orgId=${globalRedux?.selectedOrganization?.id}`, {
				headers: {
					Authorization: store.getState().loginRedux.token,
				},
			});
		} catch (error) {
			toast.error(error?.message || 'Something went wrong!');
			console.log('🚀 ~ uploadFile ~ error:', error);
		}
	};

	const column = [
		{
			title: 'S.No',
			dataIndex: 'serial',
			key: 'serial',
			width: '10%',
			align: 'center',
			render: (value, record, index) => index + 1,
		},
		{
			title: 'File Name',
			dataIndex: 'originalname',
			key: 'originalname',
			width: '35%',
			align: 'left',
		},
		{
			title: 'File Size',
			dataIndex: 'size',
			key: 'size',
			width: '20%',
			align: 'left',
			render: (value) => `${(value / (1024 * 1024)).toFixed(2)} MB`,
		},
		{
			title: 'Created at',
			dataIndex: 'createdAt',
			key: 'createdAt',
			width: '25%',
			align: 'left',
			render: (value) => getDateFormat(value),
		},
		{
			title: 'Action',
			dataIndex: 'serial',
			key: 'serial',
			width: '10%',
			align: 'center',
			render: (value, record) => (
				<Row justify="center">
					<Popconfirm
						title={`Are you sure to delete?`}
						okText="Delete"
						cancelText="No"
						placement="rightTop"
						onConfirm={() => {
							handleDeleteFile(record);
						}}>
						<Col className="delete_icon">
							<DeleteOutlined />
						</Col>
					</Popconfirm>
				</Row>
			),
		},
	];

	return (
		<Row className="" gutter={[10, 10]}>
			<Col span={24}>
				<Button icon={<UploadOutlined />} onClick={() => setUploadModal(true)}>
					Upload Files
				</Button>
			</Col>
			<Modal
				destroyOnHidden
				width={'50%'}
				className="files_upload_modal"
				title="Select files to Upload"
				open={uploadModal}
				onOk={uploadFile}
				onCancel={() => setUploadModal(false)}
				maskClosable={false}
				footer={null}>
				<Row className="files_upload_modal_container">
					<Col span={24} className="content_area">
						{fileList.length > 0 ? (
							<Row className="content_area_container">
								{fileList.map((file, index) => (
									<Col span={24} key={index} className="content_container">
										<Row className="content">
											<Col span={18} className="left_area">
												<FileImageOutlined />
												<span className="file_name">{file.name}</span>
												<span className="file_size">{`${(file.size / (1024 * 1024)).toFixed(2)} MB`}</span>
											</Col>
											<Col span={6}>
												{uploadingIndex === index && (
													<Progress
														percent={uploadProgress}
														type="line"
														strokeWidth={3}
														strokeColor={{
															'0%': '#108ee9',
															'100%': '#87d068',
														}}
													/>
												)}
											</Col>
										</Row>
									</Col>
								))}
							</Row>
						) : (
							<Dragger {...props} customRequest={dummyRequest}>
								<p className="ant-upload-drag-icon">
									<InboxOutlined />
								</p>
								<p className="ant-upload-text">Click or drag file to this area to upload</p>
							</Dragger>
						)}
					</Col>
					<Col span={24} className="footer_area">
						<Row justify={'space-between'}>
							<Col className="left_content">
								<Upload multiple showUploadList={false} {...uploadProps} customRequest={dummyRequest}>
									<Button icon={<UploadOutlined />}>Add Files</Button>
								</Upload>
							</Col>
							<Col className="right_content">
								<Row gutter={[10, 10]}>
									<Col>
										<Button
											onClick={() => {
												setUploadModal(false);
												if (cancelUploadRef?.current) {
													cancelUploadRef.current(); // Cancel the upload request
												}
											}}>
											Cancel
										</Button>
									</Col>
									<Col>
										<Button loading={uploading} disabled={uploading || fileList === 0} type="primary" onClick={uploadFile}>
											Upload
										</Button>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>
				</Row>
			</Modal>
			<Col span={24}>
				<Table
					columns={column}
					dataSource={details?.data?.files?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))}
					loading={details?.loading}
					pagination={false}
					rowKey="id"
					style={{
						width: '100%',
						minHeight: 300,
					}}
					scroll={{ y: '60vh' }}
				/>
			</Col>
		</Row>
	);
};

export default Files;
