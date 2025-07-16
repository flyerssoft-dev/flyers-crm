import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import SignaturePad from 'components/signature-pad';

const SignPage = () => {
	const [signature, setSignature] = useState(null);
	const [isEditing, setIsEditing] = useState(false);

	const handleSaveSignature = (newSignature) => {
		setSignature(newSignature);
		setIsEditing(false);
	};

	return (
		<Row className="sign-page-container">
			<Col span={8}>
				<div className="signature-container">
					{isEditing ? (
						<SignaturePad initialSignature={signature} onSaveSignature={handleSaveSignature} />
					) : (
						<>
							{signature ? (
								<div className="signature-preview">
									<img src={signature} alt="Saved Signature" />
								</div>
							) : (
								<p>No signature saved yet.</p>
							)}
							<Row gutter={[10, 10]}>
								<Col span={12}>
									<Button block danger={!!signature} type="primary" onClick={() => setIsEditing(true)}>
										{signature ? 'Change Signature' : 'Add Signature'}
									</Button>
								</Col>
								{signature && (
									<Col span={12}>
										<Button
											// style={{
											// 	width: '100%',
											// }}
											block
											type="primary">
											Confirm & Save
										</Button>
									</Col>
								)}
							</Row>
						</>
					)}
				</div>
			</Col>
		</Row>
	);
};

export default SignPage;
