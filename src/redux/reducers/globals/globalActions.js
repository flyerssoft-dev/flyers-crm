import { ACTIONS } from '../../../constants/app-constants';

function setApiStatus(apiName, status) {
	return {
		type: 'SET_API_STATUS',
		payload: {
			[apiName]: status,
		},
	};
}

function resetApiStatus(apiName) {
	return {
		type: 'SET_API_STATUS',
		payload: {
			[apiName]: null,
		},
	};
}

function setOrganizations(data) {
	return {
		type: 'SET_ORGANIZATIONS',
		payload: data,
	};
}

function setSelectedOrganization(data) {
	return {
		type: 'SET_SELECTED_ORGANIZATION',
		payload: data,
	};
}

function setCurrentPage(data) {
	return {
		type: 'SET_CURRENT_PAGE',
		payload: data,
	};
}

function setAccountBooks(data) {
	return {
		type: ACTIONS.SET_ACCOUNT_BOOKS,
		payload: data,
	};
}

function setSalesPerson(data) {
	return {
		type: ACTIONS.SET_SALES_PERSONS,
		payload: data,
	};
}

function setCategories(data) {
	return {
		type: 'SET_CATEGORIES',
		payload: data,
	};
}

function setSubCategories(data) {
	return {
		type: 'SET_SUB_CATEGORIES',
		payload: data,
	};
}

function setItemGroups(data) {
	return {
		type: 'SET_ITEM_GROUPS',
		payload: data,
	};
}

function setTags(data) {
	return {
		type: 'SET_TAGS',
		payload: data,
	};
}

function setTaxes(data) {
	return {
		type: 'SET_TAXES',
		payload: data,
	};
}

function setClasses(data) {
	return {
		type: 'SET_CLASSES',
		payload: data,
	};
}

function setVoucherHead(data) {
	return {
		type: 'SET_VOUCHERS_HEAD',
		payload: data,
	};
}
function setAssets(data) {
	return {
		type: 'SET_ASSETS',
		payload: data,
	};
}
function setVehicles(data) {
	return {
		type: 'SET_VEHICLES',
		payload: data,
	};
}
function setVendors(data) {
	return {
		type: 'SET_VENDORS',
		payload: data,
	};
}
function setCredentials(data) {
	return {
		type: 'SET_CREDENTIALS',
		payload: data,
	};
}
function setPartNumbers(data) {
	return {
		type: 'SET_PART_NUMBERS',
		payload: data,
	};
}
function setBatch(data) {
	return {
		type: 'SET_BATCHES',
		payload: data,
	};
}
function setStates(data) {
	return {
		type: 'SET_STATES',
		payload: data,
	};
}
function setUsers(data) {
	return {
		type: 'SET_USERS',
		payload: data,
	};
}
function setUnits(data) {
	return {
		type: 'SET_UNITS',
		payload: data,
	};
}
function setSizes(data) {
	return {
		type: 'SET_SIZES',
		payload: data,
	};
}

export {
	setApiStatus,
	resetApiStatus,
	setOrganizations,
	setSelectedOrganization,
	setCurrentPage,
	setAccountBooks,
	setStates,
	setClasses,
	setVoucherHead,
	setAssets,
	setVehicles,
	setBatch,
	setPartNumbers,
	setVendors,
	setCredentials,
	setUsers,
	setSalesPerson,
	setCategories,
	setSubCategories,
	setItemGroups,
	setTags,
	setTaxes,
	setUnits,
	setSizes,
};
