import React from 'react';
import ReactDOM from 'react-dom';
// import { CloseOutlined } from '@ant-design/icons';
import './pdf-viewer-iframe.scss';

const PdfViewIframe = ({ url = require('../../assets/sample.pdf'), onClose, visible }) => {
	//   const pdfUrl = process.env.PUBLIC_URL + '/sample.pdf';

	const modalBody = () => (
		<div
			style={{
				backgroundColor: '#fff',
				flexDirection: 'column',
				overflow: 'hidden',

				/* Fixed position */
				left: 0,
				position: 'fixed',
				top: 0,

				/* Take full size */
				height: '100%',
				width: '100%',

				/* Displayed on top of other elements */
				zIndex: 9999,
			}}>
			<div
				style={{
					alignItems: 'center',
					backgroundColor: '#000',
					color: '#fff',
					display: 'flex',
					padding: '.5rem',
				}}>
				<div style={{ marginRight: 'auto' }}></div>
				{/* <div style={{ marginRight: 'auto' }}>sample-file-name.pdf</div> */}
				{/* <div
					style={{
						alignItems: 'center',
						backgroundColor: '#eeeeee',
						borderBottom: '1px solid rgba(0, 0, 0, 0.3)',
						display: 'flex',
						padding: '4px',
					}}>
					<DownloadButton />
				</div> */}
				<button
					style={{
						backgroundColor: '#357edd',
						border: 'none',
						borderRadius: '4px',
						color: '#ffffff',
						cursor: 'pointer',
						padding: '8px',
					}}
					onClick={() => onClose()}>
					Close
				</button>
			</div>
			<div className="modal-overlay">
				<div className="modal-content">
					<div className="modal-body">
						<iframe title="PDF Viewer" src={url} width="100%" height="100%" />
					</div>
				</div>
			</div>
		</div>
	);
	return (
		<>
			{/* <button
				style={{
					backgroundColor: '#00449e',
					border: 'none',
					borderRadius: '.25rem',
					color: '#fff',
					cursor: 'pointer',
					padding: '.5rem',
				}}
				onClick={() => setShown(true)}>
				Open modal
			</button> */}
			{/* <Col
				onClick={() => {
					setShown(true);
				}}
				className="edit_icon">
				<EyeOutlined />
			</Col> */}
			{visible && ReactDOM.createPortal(modalBody(), document.body)}
			{/* <div
				style={{
					border: '1px solid rgba(0, 0, 0, 0.3)',
					height: '750px',
				}}>
				<Viewer fileUrl={require('../../assets/sample.pdf')} />
				<Viewer fileUrl="https://react-pdf-viewer.dev/assets/pdf-open-parameters.pdf" />
			</div> */}
		</>
	);
};

export default PdfViewIframe;
