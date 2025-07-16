import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';

const FaqExtractor = () => {
	const [faqData, setFaqData] = useState(null);
	const [fileName, setFileName] = useState('');
	const [title, setTitle] = useState('');
	const [stateDesc, setStateDesc] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [finalJson, setFinalJson] = useState(null);
	const [error, setError] = useState('');
	const [hasUploaded, setHasUploaded] = useState(false);

	const handleReset = () => {
		setFileName('');
		setTitle('');
		setStateDesc('');
		setStateCode('');
		setFaqData(null);
		setFinalJson(null);
		setHasUploaded(false);
		setError('');
	};

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		handleReset(); // Reset all data

		if (fileRejections.length > 0) {
			setError('❌ Unsupported file type. Please upload a .xlsx Excel file only.');
			return;
		}

		const file = acceptedFiles[0];
		if (!file) return;
		setFileName(file.name);
		setHasUploaded(true);

		const reader = new FileReader();
		reader.onload = (e) => {
			const data = new Uint8Array(e.target.result);
			const workbook = XLSX.read(data, { type: 'array' });
			const sheet = workbook.Sheets[workbook.SheetNames[0]];
			const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });

			const extractedTitle = rows[0]?.[0]?.trim() || '';
			const prefixedTitle = extractedTitle.startsWith('The') ? extractedTitle : `The ${extractedTitle}`;
			setTitle(prefixedTitle);

			const extractedStateDesc = extractedTitle.split(' ')[0];
			setStateDesc(extractedStateDesc);

			const extractedStateCode = extractedStateDesc.slice(0, 2).toUpperCase();
			setStateCode(extractedStateCode);

			const faqs = [];
			let currentCategory = '';
			let currentQuestions = [];

			for (let i = 2; i < rows.length; i++) {
				const [col1, col2] = rows[i];
				if (col1 && !col2) {
					if (currentCategory && currentQuestions.length > 0) {
						faqs.push({ category: currentCategory, questions: currentQuestions });
					}
					currentCategory = col1;
					currentQuestions = [];
				} else if (col1 && col2) {
					currentQuestions.push({ question: col1, answer: col2 });
				}
			}

			if (currentCategory && currentQuestions.length > 0) {
				faqs.push({ category: currentCategory, questions: currentQuestions });
			}

			const final = {
				title: prefixedTitle,
				stateDesc: extractedStateDesc,
				stateCode: extractedStateCode,
				isEnable: true,
				faqs,
			};

			setFaqData(faqs);
			setFinalJson(final);
		};

		reader.readAsArrayBuffer(file);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
		},
		multiple: false,
	});

	return (
		<div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
			<h2>📄 Drag & Drop FAQ Excel Viewer</h2>

			<div
				{...getRootProps()}
				style={{
					border: '2px dashed #aaa',
					padding: '30px',
					textAlign: 'center',
					borderRadius: '8px',
					background: isDragActive ? '#f0f0f0' : '#fafafa',
					cursor: 'pointer',
				}}>
				<input {...getInputProps()} />
				{!hasUploaded && !error && (
					<p>
						Drag and drop your <strong>.xlsx</strong> file here, or click to select
					</p>
				)}
				{error && (
					<p>
						<span style={{ color: 'red' }}>{error}</span>
						<br />
						Please upload a valid <strong>.xlsx</strong> file.
					</p>
				)}
				{isDragActive && <p>Drop the file here...</p>}

				{fileName && (
					<div style={{ marginTop: 10 }}>
						<p style={{ fontStyle: 'italic' }}>✅ {fileName}</p>
						<button
							onClick={(e) => {
								e.stopPropagation(); // prevent dialog
								handleReset();
							}}
							style={{
								background: '#ff4d4f',
								color: 'white',
								border: 'none',
								padding: '8px 12px',
								borderRadius: '4px',
								cursor: 'pointer',
								marginTop: '8px',
							}}>
							🗑️ Remove File
						</button>
					</div>
				)}
			</div>

			{/* {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>} */}

			{title && (
				<div style={{ marginTop: 20, background: '#eee', padding: 10, borderRadius: 4 }}>
					<p>
						<strong>Title:</strong> {title}
					</p>
					<p>
						<strong>State Desc:</strong> {stateDesc}
					</p>
					<p>
						<strong>State Code:</strong> {stateCode}
					</p>
				</div>
			)}

			{faqData && (
				<div style={{ marginTop: 20 }}>
					{faqData.map((section, index) => (
						<div key={index} style={{ marginBottom: 20 }}>
							<div style={{ background: '#d9d9d9', padding: '10px', fontWeight: 'bold', borderRadius: '4px' }}>📁 {section.category}</div>
							{section.questions.map((q, i) => (
								<div key={i} style={{ marginLeft: 20, marginTop: 5 }}>
									<div style={{ color: 'green', fontWeight: 'bold' }}>❓ {q.question}</div>
									<div style={{ color: '#333', marginLeft: 10, marginBottom: 10 }}>📄 {q.answer}</div>
								</div>
							))}
						</div>
					))}
				</div>
			)}

			{finalJson && (
				<div style={{ marginTop: 20 }}>
					<h4>📦 Output JSON:</h4>
					<pre style={{ background: '#f8f8f8', padding: 10, borderRadius: 4, maxHeight: 300, overflowY: 'auto' }}>{JSON.stringify(finalJson, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default FaqExtractor;
