import moment from 'moment';
import axios from 'axios';
import { message } from 'antd';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';
import { DATE_FORMAT, NOTIFICATION_STATUS_TYPES } from 'constants/app-constants';
import { ToastifyNotification } from 'components/toast-component';
import { SERVER_IP } from 'assets/Config';

export const getFirstLetterFromWords = (string = '') => string?.match(/\b\w/g)?.join('');

export const getTheRoundOffValue = (value = 0) => {
	let final = 0;
	const roundValue = Math.round(value);
	final = roundValue - value;
	return {
		value: roundValue,
		remain: parseFloat(final).toFixed(2),
		type: final > 0 ? 'round' : 'floor',
	};
};

export const removeEmptyFields = (obj = {}) => {
	const filteredValue = Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''));
	return {
		filteredValue,
		totalLength: Object.keys(obj).length,
		filteredLength: Object.keys(filteredValue).length,
	};
};
export const getLengthOfObj = (obj = {}) => Object.keys(obj).length;

export const generatePagination = (tableData = []) => {
	if (tableData?.length > 0) {
		const tableBtns = document.getElementsByClassName('ant-pagination-item-link');
		const nextBtn = document.getElementsByClassName('ant-pagination-item-link')[tableBtns.length - 1];
		nextBtn.innerHTML = 'Next >';
		nextBtn.style.paddingLeft = '8px';
		nextBtn.style.paddingRight = '8px';
		const prevBtn = document.getElementsByClassName('ant-pagination-item-link')[0];
		prevBtn.innerHTML = '< Previous';
		prevBtn.style.paddingLeft = '8px';
		prevBtn.style.paddingRight = '8px';
	}
};

export const formQueryStringFromObject = (data) =>
	Object.keys(data)
		.filter((key) => data[key] !== '' && data[key] !== undefined)
		.map((key) => key + '=' + data[key])
		.join('&');

export function camelize(str) {
	return str
		.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
			return index === 0 ? word.toLowerCase() : word.toUpperCase();
		})
		.replace(/\s+/g, '');
}

export const generateGreetings = () => {
	var currentHour = moment().format('HH');
	if (currentHour >= 3 && currentHour < 12) {
		return 'Good Morning';
	} else if (currentHour >= 12 && currentHour < 15) {
		return 'Good Afternoon';
	} else if (currentHour >= 15 && currentHour < 20) {
		return 'Good Evening';
	} else if (currentHour >= 20 && currentHour < 3) {
		return 'Good Night';
	} else {
		return 'Hello';
	}
};

export const objToQs = (params) =>
	Object.keys(params)
		.map((key) => params[key] && key + '=' + params[key])
		.filter((params) => params)
		.join('&');

export const showToast = (title = '', body = '', type = NOTIFICATION_STATUS_TYPES.SUCCESS, position = 'top-right') => {
	return toast(<ToastifyNotification type={type} title={title} body={body} />, {
		position,
		autoClose: 2000,
	});
};

export const handleDownload = async (filePath) => {
	try {
		// Replace 'https://example.com/your-remote-pdf-file.pdf' with the actual URL of the remote PDF file
		const url = SERVER_IP + filePath;

		// Fetch the PDF file as a Blob
		const response = await axios.get(url, {
			responseType: 'blob',
		});

		// Get the filename from the response headers (if available)
		const contentDisposition = response.headers['content-disposition'];
		const fileName = contentDisposition ? contentDisposition.split(';')[1].trim().split('=')[1] : 'downloaded.pdf';

		// Save the PDF file using FileSaver.js
		saveAs(new Blob([response.data]), fileName);
	} catch (error) {
		console.error('Error downloading PDF:', error);
	}
};

export const downloadFileFromURL = async (
	url,
	fileName = `invoice_report_${moment().format(`${DATE_FORMAT.DD_MM_YYYY} h:mm A`)}_${moment().valueOf()}`
) => {
	const response = await fetch(url);
	if (response.ok) {
		const blob = await response.blob();
		const urlObject = window.URL.createObjectURL(blob);

		const link = document.createElement('a');
		link.href = urlObject;
		link.download = fileName; // You can set the file name here
		document.body.appendChild(link);
		link.click();

		link.remove();
		window.URL.revokeObjectURL(urlObject);
	} else {
		showToast('Sorry!', 'Failed to download file', NOTIFICATION_STATUS_TYPES.ERROR, 'top-right');
	}
};

export const downloadFile = (filePath, fileName = `invoice_${moment().format(`${DATE_FORMAT.DD_MM_YYYY} h:mm A`)}_${moment().valueOf()}.pdf`) => {
	fetch(SERVER_IP + filePath, {
		method: 'GET',
		mode: 'no-cors',
		headers: {
			'Content-Type': 'application/pdf',
			Accept: 'application/pdf',
		},
	})
		.then((response) => response.blob())
		.then((blob) => {
			console.log('🚀 ~ file: index.js:94 ~ blob:', blob);
			const url = window.URL.createObjectURL(new Blob([blob]));
			const link = document.createElement('a');
			link.href = url;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
		});
};

export const convertToIndianRupees = (number) => {
	// Check if the input is a number or can be parsed to a number
	if (isNaN(number) && typeof number !== 'number') {
		return 'Invalid input';
	}

	// Convert the number to a string with two decimal places
	number = parseFloat(number).toFixed(2);

	// Split the number into integer and decimal parts
	var parts = number.toString().split('.');
	var rupees = parts[0];
	var paise = parts[1] || '00'; // If no decimal part, default to '00'

	// Add commas for thousands, lakhs, crores, etc.
	var formattedRupees = rupees.replace(/(\d)(?=(\d\d)+\d$)/g, '$1,');

	// Create the Indian Rupees format string
	var result = '₹' + formattedRupees + '.' + paise;

	return result;
};

// Example usage:
var amount = 1234567.89;
var formattedAmount = convertToIndianRupees(amount);
// console.log(formattedAmount); // Output: ₹ 12,34,567.89

export const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text);
		message.success(text + ' Copied');
	} catch (err) {
		console.error('Failed to copy: ', err);
	}
};

export const calculatePurchaseValues = (data, itemTaxPreferenceValue) => {
	const actualTotal = (parseFloat(data?.qty) || 0) * (parseFloat(data?.rate) || 0);
	const discountPercentage = parseFloat(data?.discount) || 0;
	const discountAmountFromUser = parseFloat(data?.discountAmount) || 0;

	let discountAmount = 0;

	if (discountPercentage > 0) {
		discountAmount = actualTotal * (discountPercentage / 100);
	} else if (discountAmountFromUser > 0) {
		discountAmount = discountAmountFromUser;
	}

	const taxableValue = actualTotal - discountAmount;

	let netAmount, taxAmount, grossAmount;
	const rate = parseFloat(data?.taxRate) || 0;

	if (itemTaxPreferenceValue === 'Exclusive') {
		netAmount = taxableValue;
		taxAmount = taxableValue * (rate / 100);
		grossAmount = netAmount + taxAmount;
	} else if (itemTaxPreferenceValue === 'Inclusive') {
		grossAmount = taxableValue;
		netAmount = (100 * taxableValue) / (100 + rate);
		taxAmount = grossAmount - netAmount;
	} else if (itemTaxPreferenceValue === 'None') {
		netAmount = taxableValue;
		taxAmount = 0;
		grossAmount = taxableValue;
	}

	console.log("🚀 ~ calculatePurchaseValues ~ taxAmount:", taxAmount, taxableValue, rate);

	return {
		actualTotal: actualTotal.toFixed(2),
		discountAmount: discountAmount,
		taxableValue: netAmount.toFixed(2),
		taxAmount: taxAmount.toFixed(2),
		totalAmount: grossAmount.toFixed(2),
	};
};

export const formatToIndianRupees = (amount) => {
	// Check if amount is not a number
	if (isNaN(amount)) {
		return 'Invalid amount';
	}

	// Convert number to string and split into integer and decimal parts
	let [integerPart, decimalPart] = parseFloat(amount).toFixed(2).split('.');

	// Add commas to separate thousands in integer part
	integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

	// Add Indian Rupee symbol (₹) and combine integer and decimal parts
	return `₹${integerPart}${decimalPart ? `.${decimalPart}` : ''}`;
};