import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { message } from 'antd';
import { getApi } from 'redux/sagas/getApiDataSaga';
import { SERVER_IP } from 'assets/Config';
import ExportInvoiceListPresentational from './export-invoice-list-presentational';
import PdfViewerModal from 'components/pdf-viewer-modal';
import { DATE_FORMAT } from 'constants/app-constants';
import axios from 'axios';

const ExportInvoiceListFunctional = React.memo(() => {
	const dispatch = useDispatch();
	const token = useSelector((state) => state?.loginRedux.token);
	const customers = useSelector((state) => state?.customerRedux?.customers);
	const globalState = useSelector((state) => state.globalRedux);

	const [filterOptions, setFilterOptions] = useState({
		customerId: '',
		fromDate: moment().subtract(1, 'months'),
		toDate: moment(),
		invoiceType: 'tax_invoice',
		copyType: 'Original',
	});

	const [pdfBlobUrl, setPdfBlobUrl] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [isPdfValid, setIsPdfValid] = useState(false);
	const [isLoadingPdf, setIsLoadingPdf] = useState(false);

	const getCustomers = useCallback(() => {
		const url = `${SERVER_IP}customer?orgId=${globalState?.selectedOrganization?.id}`;
		dispatch(getApi('GET_CUSTOMERS', url));
	}, [dispatch, globalState?.selectedOrganization?.id]);

	useEffect(() => {
		getCustomers();
	}, [getCustomers]);

	const generatePdfUrl = () => {
		const { customerId, invoiceType, fromDate, toDate, copyType } = filterOptions;
		const query = `orgId=${globalState?.selectedOrganization?.id}&customerId=${customerId}&invoiceType=${invoiceType}&fromDate=${moment(fromDate).format(DATE_FORMAT.YYYY_MM_DD)}&toDate=${moment(toDate).format(
			DATE_FORMAT.YYYY_MM_DD
		)}&copyType=${copyType}`;
		return `${SERVER_IP}invoice/export?${query}`;
	};

	const handlePrintPreview = async () => {
		if (!filterOptions.customerId) {
			message.warning('Please select a customer');
			return;
		}

		setIsLoadingPdf(true);
		try {
			const pdfUrl = generatePdfUrl();

			const response = await axios.get(pdfUrl, {
				responseType: 'blob',
				headers: { Accept: 'application/pdf', Authorization: `${token}` },
			});

			if (response.status === 200 && response.data.type === 'application/pdf') {
				const blobUrl = URL.createObjectURL(response.data);
				setPdfBlobUrl(blobUrl);
				setIsPdfValid(true);
				setShowModal(true);
			} else {
				message.error('Invalid PDF response');
				setIsPdfValid(false);
			}
		} catch (error) {
			console.error('PDF fetch error:', error);

			// 🔍 Extract backend message from error response
			if (axios.isAxiosError(error) && error.response?.data) {
				try {
					// Read text from blob and parse as JSON
					const errorText = await error.response.data.text();
					const errorData = JSON.parse(errorText);
					message.error(errorData.message || 'Could not preview PDF');
				} catch (parseError) {
					message.error('Could not preview PDF');
				}
			} else {
				message.error('Could not preview PDF');
			}

			setIsPdfValid(false);
		} finally {
			setIsLoadingPdf(false);
		}
	};

	const handleDownload = () => {
		if (!pdfBlobUrl || !isPdfValid) return;

		const downloadLink = document.createElement('a');
		downloadLink.href = pdfBlobUrl;
		downloadLink.download = `invoice-${filterOptions?.customerId || 'file'}.pdf`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
	};

	const handleResetFilters = () => {
		setFilterOptions({
			customerId: '',
			fromDate: moment().subtract(1, 'months'),
			toDate: moment(),
			invoiceType: 'tax_invoice',
			copyType: 'Original',
		});
		setPdfBlobUrl('');
		setIsPdfValid(false);
		setShowModal(false);
	};

	return (
		<>
			<ExportInvoiceListPresentational
				customers={customers}
				filterOptions={filterOptions}
				handleFilterOptions={(key, value) => setFilterOptions((prev) => ({ ...prev, [key]: value }))}
				handlePrintPreview={handlePrintPreview}
				isPdfValid={isPdfValid}
				handleDownload={handleDownload}
				handleResetFilters={handleResetFilters}
				isLoadingPdf={isLoadingPdf}
			/>

			<PdfViewerModal open={showModal} onClose={() => setShowModal(false)} previewUrlFromProps={pdfBlobUrl} download={false} handleDownload={handleDownload} />
		</>
	);
});

export default ExportInvoiceListFunctional;
