import React from 'react';
import { Button } from 'antd';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import useSound from 'use-sound';
import moment from 'moment';
import { FileExcelOutlined } from '@ant-design/icons';
import { DATE_FORMAT } from 'constants/app-constants';
import boopSfx from '../assets/sounds/boop.mp3';

// const columns = [
// 	{ header: 'First Name', key: 'firstName' },
// 	{ header: 'Last Name', key: 'lastName' },
// 	{ header: 'Purchase Price', key: 'purchasePrice' },
// 	{ header: 'Payments Made', key: 'paymentsMade' },
// ];

// const data = [
// 	{
// 		firstName: 'Kylie',
// 		lastName: 'James',
// 		purchasePrice: 1000,
// 		paymentsMade: 900,
// 	},
// 	{
// 		firstName: 'Harry',
// 		lastName: 'Peake',
// 		purchasePrice: 1000,
// 		paymentsMade: 1000,
// 	},
// ];

export const saveExcelHook = async (data = [], headers = []) => {
	const columns = headers?.map((header) => ({
		header: header,
		key: header,
	}));
	const workbook = new Excel.Workbook();
	const workSheetName = 'Worksheet-1';
	const workBookName = `excel_report_${moment().format(`${DATE_FORMAT.DD_MM_YYYY} h:mm A`)}_${moment().valueOf()}`;
	try {
		// const myInput = document.getElementById(myInputId);
		const fileName = workBookName;

		// creating one worksheet in workbook
		const worksheet = workbook.addWorksheet(workSheetName);

		// add worksheet columns
		// each columns contains header and its mapping key from data
		worksheet.columns = columns;

		// updated the font for first row.
		worksheet.getRow(1).font = { bold: true };

		// loop through all of the columns and set the alignment with width.
		worksheet.columns.forEach((column) => {
			column.width = column.header.length + 5;
			column.alignment = { horizontal: 'center' };
		});

		// loop through data and add each one to worksheet
		data.forEach((singleData) => {
			worksheet.addRow(singleData);
		});

		// loop through all of the rows and set the outline style.
		worksheet.eachRow({ includeEmpty: false }, (row) => {
			// store each cell to currentCell
			const currentCell = row._cells;

			// loop through currentCell to apply border only for the non-empty cell of excel
			currentCell.forEach((singleCell) => {
				// store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
				const cellAddress = singleCell._address;

				// apply border
				worksheet.getCell(cellAddress).border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				};
			});
		});

		// write the content using writeBuffer
		const buf = await workbook.xlsx.writeBuffer();

		// download the processed file
		saveAs(new Blob([buf]), `${fileName}.xlsx`);
	} catch (error) {
		console.error('<<<ERRROR>>>', error);
		console.error('Something Went Wrong', error.message);
	} finally {
		// removing worksheet's instance to create new one
		workbook.removeWorksheet(workSheetName);
	}
};

const ExcelDownload = ({ data = [], headers = [], iconOnly = false , style={}}) => {
	const [play] = useSound(boopSfx);
	const workSheetName = 'Worksheet-1';
	const workBookName = `excel_report_${moment().format(`${DATE_FORMAT.DD_MM_YYYY} h:mm A`)}_${moment().valueOf()}`;

	const columns = headers?.map((header) => ({
		header: header,
		key: header,
	}));
	const workbook = new Excel.Workbook();

	const saveExcel = async () => {
		try {
			// const myInput = document.getElementById(myInputId);
			const fileName = workBookName;

			// creating one worksheet in workbook
			const worksheet = workbook.addWorksheet(workSheetName);

			// add worksheet columns
			// each columns contains header and its mapping key from data
			worksheet.columns = columns;

			// updated the font for first row.
			worksheet.getRow(1).font = { bold: true };

			// loop through all of the columns and set the alignment with width.
			worksheet.columns.forEach((column) => {
				column.width = column.header.length + 5;
				column.alignment = { horizontal: 'center' };
			});

			// loop through data and add each one to worksheet
			data.forEach((singleData) => {
				worksheet.addRow(singleData);
			});

			// loop through all of the rows and set the outline style.
			worksheet.eachRow({ includeEmpty: false }, (row) => {
				// store each cell to currentCell
				const currentCell = row._cells;

				// loop through currentCell to apply border only for the non-empty cell of excel
				currentCell.forEach((singleCell) => {
					// store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
					const cellAddress = singleCell._address;

					// apply border
					worksheet.getCell(cellAddress).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				});
			});

			// write the content using writeBuffer
			const buf = await workbook.xlsx.writeBuffer();

			// download the processed file
			saveAs(new Blob([buf]), `${fileName}.xlsx`);
			play?.();
		} catch (error) {
			console.error('<<<ERRROR>>>', error);
			console.error('Something Went Wrong', error.message);
		} finally {
			// removing worksheet's instance to create new one
			workbook.removeWorksheet(workSheetName);
		}
	};

	if (data?.length > 0) {
		return (
			<Button style={style} type="primary" icon={<FileExcelOutlined />} onClick={saveExcel}>
				{iconOnly ? '' : 'Export as Excel'}
			</Button>
		);
	}

	return null;
};

export default ExcelDownload;
