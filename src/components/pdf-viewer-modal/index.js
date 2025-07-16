import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Button, Typography, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { downloadFileFromURL } from 'helpers';
import { SERVER_IP } from 'assets/Config';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './pdf-viewer-modal.scss';

const { Title } = Typography;

const PdfViewerModal = ({ selectedFile, open, onClose, previewUrlFromProps, download = true, handleDownload = null }) => {
	const globalRedux = useSelector((state) => state?.globalRedux);
	const orgId = globalRedux?.selectedOrganization?._id;

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (open && selectedFile?._id || previewUrlFromProps) {
			setLoading(true);
		}
	}, [open, selectedFile?._id]);

	const previewUrl = useMemo(() => {
		return `${SERVER_IP}/invoice/preview/${selectedFile?._id}?orgId=${orgId}`;
	}, [selectedFile?._id, orgId]);

	const downloadUrl = useMemo(() => {
		return `${SERVER_IP}/invoice/download/${selectedFile?._id}?orgId=${orgId}`;
	}, [selectedFile?._id, orgId]);

	const downloadFromURL = () => {
		downloadFileFromURL(downloadUrl);
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={null}
			width="60%"
			className="pdf-viewer-modal"
			centered={false} // 👈 remove vertical centering
			style={{ top: 0 }} // 👈 align near top
			destroyOnHidden>
			<div className="pdf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginRight: 40 }}>
				<Title level={4} style={{ margin: 0 }}>
					{loading ? <Skeleton width={120} height={24} /> : selectedFile?.invoiceNumber ? `INV-${selectedFile?.invoiceNumber}` : `INV`}
				</Title>
				{(download || handleDownload) && <Space>
					{loading ? (
						<Skeleton width={100} height={32} borderRadius={8} />
					) : (
						<Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload || downloadFromURL} disabled={!handleDownload ? !selectedFile?._id || loading : false} style={{ borderRadius: 8 }}>
							Download
						</Button>
					)}
				</Space>}
			</div>

			{/* Skeleton loader */}
			{loading && <Skeleton height={600} borderRadius={0} style={{ marginBottom: 12 }} containerClassName="pdf-skeleton-loader" />}

			{/* Iframe PDF viewer */}
			<iframe
				className="pdf-viewer-modal-iframe"
				title="PDF Viewer"
				src={previewUrlFromProps || previewUrl}
				width="100%"
				height="600px"
				style={{
					border: '1px solid #ccc',
					borderRadius: 0,
					display: loading ? 'none' : 'block',
				}}
				onLoad={() => setLoading(false)}
			/>
		</Modal>
	);
};

export default PdfViewerModal;
