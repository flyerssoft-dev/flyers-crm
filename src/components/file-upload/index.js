import React, { useRef } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';

export const FileUpload = ({ handleSelectFile, fileList, maxFileSizeMB = 3, maxFiles = 5 }) => {
    const fileInputRef = useRef(null);

	const handleValidation = (e) => {
			const files = Array.from(e.target.files);
			const newFileList = [];
	
			files.forEach((file) => {
				const isAllowedType = file.type === 'application/pdf' || file.type.startsWith('image/');
				const isSizeValid = file.size / 1024 / 1024 < maxFileSizeMB;
	
				if (!isAllowedType) {
					message.error('You can only upload PDF, JPG, JPEG, or PNG files!');
				} else if (!isSizeValid) {
					message.error(`File must be smaller than ${maxFileSizeMB}MB!`);
				} else {
					newFileList.push(file);
				}
			});
	
			if (newFileList.length + fileList.length <= maxFiles) {
				const updatedFileList = [...fileList, ...newFileList];
				handleSelectFile(updatedFileList);
			} else {
				message.error(`You can upload up to ${maxFiles} files only!`);
			}
		};

    return (
        <div className="file-upload-container">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleValidation}
                multiple
                style={{ display: 'none' }}
                id="file-upload-input"
            />

            <Button
                className="upload-button"
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
            >
                Documents
            </Button>

            {fileList?.length > 0 && (
                <div className="file-list">
                    <ul>
                        {fileList.map((file, index) => (
                            <li key={index} className="file-item">{file.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;
