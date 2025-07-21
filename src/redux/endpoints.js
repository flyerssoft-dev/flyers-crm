import { SERVER_IP } from '../assets/Config';

const API_ENDPOINTS = {
	LOGIN: `${SERVER_IP}auth/login`,
	SEND_OTP: `${SERVER_IP}auth/requestotp`,
	VERIFY_OTP: `${SERVER_IP}auth/verifyotp`,
	REGISTER: `${SERVER_IP}auth/sign-up`,
	GET_ALL_ORGANIZATION: `${SERVER_IP}organization?page=1&limit=10&sort=asc`,
	ADD_ORDER: `${SERVER_IP}order`,
	ADD_ESTIMATE: `${SERVER_IP}order`,
	ADD_PURCHASE: `${SERVER_IP}purchase`,
	ADD_TAX_INVOICE: `${SERVER_IP}invoice`,
	ADD_COMPOSITE: `${SERVER_IP}composite`,
	ADD_INVENTORY: `${SERVER_IP}inventory`,
	ADD_TASK: `${SERVER_IP}task`,
	ADD_STUDENT: `${SERVER_IP}student`,
	ADD_VOUCHER: `${SERVER_IP}voucher`,
	ADD_RECEIPT: `${SERVER_IP}receipt`,
	ADD_LOAD_IN: `${SERVER_IP}load`,
	GET_ALL_PROJECTS: `${SERVER_IP}project`,
	GET_PROJECTS: `${SERVER_IP}project`,
	ADD_PROJECT: `${SERVER_IP}project`,
	ADD_MILESTONE: `${SERVER_IP}milestone`,
	ADD_ITEM: `${SERVER_IP}item`,
	ADD_SUB_ITEM: `${SERVER_IP}subitem`,
	ADD_CUSTOMER: `${SERVER_IP}customer`,
	ADD_SCHEDULER: `${SERVER_IP}scheduler`,
	ADD_LEAD: `${SERVER_IP}customer`,
	ADD_UNIT: `${SERVER_IP}unit`,
	ADD_USER: `${SERVER_IP}user/invite-staff`,
	MODIFY_USER_ROLE: `${SERVER_IP}user/assignrole`,
	REGISTER_USER: `${SERVER_IP}auth/verifyuserotp`,
	ADD_SUPPLIER: `${SERVER_IP}supplier`,
	ADD_AGENT: `${SERVER_IP}agent`,
	ADD_DAILY_TRANSACTION: `${SERVER_IP}voucher`,
	ADD_DAILY_PRODUCTION: `${SERVER_IP}production`,
	ADD_INVOICE: `${SERVER_IP}invoice`,
	ADD_TICKET: `${SERVER_IP}ticket`,
	ADD_ORGANIZATION: `${SERVER_IP}organization`,
	ADD_ACCOUNT_BOOK: `${SERVER_IP}accbook`,
	ADD_SALES_PERSON: `${SERVER_IP}salesperson`,

	// Item Group APIS
	ADD_ITEM_GROUP: `${SERVER_IP}itemgroup`,
	EDIT_ITEM_GROUP: `${SERVER_IP}itemgroup`,

	// Category APIS
	ADD_CATEGORY: `${SERVER_IP}category`,
	EDIT_CATEGORY: `${SERVER_IP}category`,

	// Sub Category APIS
	ADD_SUB_CATEGORY: `${SERVER_IP}subcategory`,
	EDIT_SUB_CATEGORY: `${SERVER_IP}subcategory`,

	// Tag APIS
	ADD_TAG: `${SERVER_IP}tag`,
	EDIT_TAG: `${SERVER_IP}tag`,

	ADD_VOUCHER_HEAD: `${SERVER_IP}voucherhead`,
	ADD_ASSETS: `${SERVER_IP}asset`,
	ADD_VEHICLE: `${SERVER_IP}vehicle`,
	ADD_VENDOR: `${SERVER_IP}vendor`,
	ADD_CREDENTIAL: `${SERVER_IP}credential`,
	ADD_PART_NUMBER: `${SERVER_IP}partnumber`,
	ADD_BATCH: `${SERVER_IP}batch`,
	ADD_CLASS: `${SERVER_IP}class`,
	ADD_BATCH_BALANCE: `${SERVER_IP}batchbalance`,
	ME_API:`${SERVER_IP}employeeDetails/me`
};

export default API_ENDPOINTS;
