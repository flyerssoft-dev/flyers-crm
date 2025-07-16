import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { SERVER_IP } from 'assets/Config';
import { DATE_FORMAT } from 'constants/app-constants';
import ExportGstJsonListPresentational from './export-gst-json-list-presentational';

const ExportGstJsonListFunctional = () => {
	const token = useSelector((state) => state?.loginRedux?.token);
	const orgId = useSelector((state) => state?.globalRedux?.selectedOrganization?._id);

	const [isLoading, setIsLoading] = useState(false);
	const [selectedGstType, setSelectedGstType] = useState('gstr1');

	const [filterOptions, setFilterOptions] = useState({
		fromDate: moment().startOf('month').format(DATE_FORMAT.YYYY_MM_DD),
		toDate: moment().endOf('month').format(DATE_FORMAT.YYYY_MM_DD),
	});

	const handleFilterOptions = (field, value) => {
		setFilterOptions((prev) => ({ ...prev, [field]: value }));
	};

	const applyPreset = (type) => {
		let from, to;
		const today = moment();

		if (type === 'this') {
			from = today.clone().startOf('month');
			to = moment.min(today.clone(), today.clone().endOf('month')); // prevent future dates
		} else if (type === 'last') {
			from = today.clone().subtract(1, 'month').startOf('month');
			to = from.clone().endOf('month');
		} else {
			// fiscal year (Apr to Mar)
			const isBeforeApril = today.month() < 3;
			from = today
				.clone()
				.year(isBeforeApril ? today.year() - 1 : today.year())
				.month(3)
				.startOf('month');
			to = today.clone(); // today = up to current day, not future
		}

		setFilterOptions({
			fromDate: from.format(DATE_FORMAT.YYYY_MM_DD),
			toDate: to.format(DATE_FORMAT.YYYY_MM_DD),
		});
	};

	const handleDownloadGstJson = async () => {
		if (!orgId) return message.warning('Organization not selected');

		const { fromDate, toDate } = filterOptions;

		if (!fromDate || !toDate) {
			message.warning('Please select both From and To dates.');
			return;
		}

		if (moment(toDate).isBefore(moment(fromDate))) {
			message.warning('To Date must be later than or equal to From Date.');
			return;
		}

		if (moment(fromDate).isAfter(moment()) || moment(toDate).isAfter(moment())) {
			message.warning('Future dates are not allowed.');
			return;
		}

		setIsLoading(true);
		try {
			const url = `${SERVER_IP}export/${selectedGstType}?orgId=${orgId}&fromDate=${fromDate}&toDate=${toDate}`;

			const response = await axios.get(url, {
				responseType: 'blob',
				headers: {
					Authorization: token,
					Accept: 'application/json',
				},
			});

			const blob = new Blob([response.data], { type: 'application/json' });
			const reader = new FileReader();

			reader.onload = () => {
				try {
					JSON.parse(reader.result);
					const fileName = `${selectedGstType}_${fromDate}_to_${toDate}.json`;

					const downloadUrl = URL.createObjectURL(blob);
					const a = document.createElement('a');
					a.href = downloadUrl;
					a.download = fileName;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
					URL.revokeObjectURL(downloadUrl);

					message.success(`${fileName} downloaded successfully.`);
				} catch {
					message.error('Received file is not valid JSON.');
				}
			};
			reader.readAsText(blob);
		} catch (error) {
			console.error('Download error:', error);
			message.error('Failed to download GST JSON.');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<ExportGstJsonListPresentational
			isLoading={isLoading}
			selectedGstType={selectedGstType}
			onGstTypeChange={setSelectedGstType}
			filterOptions={filterOptions}
			handleFilterOptions={handleFilterOptions}
			onDownload={handleDownloadGstJson}
			onApplyPreset={applyPreset}
		/>
	);
};

export default ExportGstJsonListFunctional;
