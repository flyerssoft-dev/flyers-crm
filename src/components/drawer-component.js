import React from 'react';
import { Drawer } from 'antd';
import AddVoucher from 'pages/master-component/AddVoucher';
import AddCustomer from 'pages/master-component/AddCustomer';
import AddSalesPerson from 'pages/master-component/sales-person/add-sales-person';
import AddAccountBook from 'pages/master-component/acc-book/add-acc-book';
import AddCategory from 'pages/master-component/categories/add-category';
import AddVoucherHead from 'pages/master-component/voucher-head/add-voucher-head';
import AddSubCategory from 'pages/master-component/sub-categories/add-sub-category';
import AddItemGroup from 'pages/master-component/item-groups/add-item-group';
// import AddItem from 'pages/master-component/AddItem';
// import AddAsset from 'pages/master-component/AddAsset';
// import AddVendor from 'pages/master-component/AddVendor';
// import AddCredential from 'pages/master-component/AddCredential';

const AddDrawer = ({
	width,
	setSupplierAddModal = null,
	setAgentAddModal = null,
	getAgents = null,
	refreshList,
	getStaffs,
	getAssets,
	editVehicle,
	accBookAddModal,
	setAccBookAddModal,
	getAccountBooks,
	editAccountBooks,
	accountBookModal,
	setAccountBookModal,
	getVouchers,
	editVoucher,
	vehicleAddModal,
	setVehicleAddModal,
	getVehicle,
	getClass,
	getVendor,
	getCredential,
	customerAddModal,
	setCustomerAddModal,
	getCustomers,
	editCustomer,
	getItems,
	salesPersonAddModal,
	setSalesPersonAddModal,
	getSalesPersons,
	editSalesPerson,
	categoryAddModal,
	setItemGroupAddModal,
	getItemGroups,
	editItemGroups,
	itemGroupAddModal,
	setCategoryAddModal,
	getCategories,
	editCategories,
	subCategoryAddModal,
	setSubCategoryAddModal,
	getSubCategories,
	editSubCategory,
	voucherHeadModal, 
	getVoucherHeads, 
	editVoucherHead, 
	setVoucherHeadModal,
	selectedCategory
}) => {
	// const showConfirm = useCallback(() => {
	// 	confirm({
	// 		title: 'Do you want to close this window?',
	// 		icon: <ExclamationCircleOutlined />,
	// 		content: 'You will be lost all the details you have entered here.',
	// 		onOk() {
	// 			toggleVisible(false);
	// 		},
	// 		onCancel() {
	//
	// 		},
	// 	});
	// }, [toggleVisible]);

	const handleClose = () => {
		setSupplierAddModal?.(false);
		setAgentAddModal?.(false);
		getAgents?.();
		refreshList?.();
		getStaffs?.();
		getAssets?.();
		getAccountBooks?.();
		getVouchers?.();
		getVoucherHeads?.();
		getItems?.();
		getVehicle?.();
		getClass?.();
		getVendor?.();
		getCredential?.();
		getCustomers?.();
		getItems?.();
		getSalesPersons?.();
		getCategories?.();
		getSubCategories?.();
		getItemGroups?.();
	};
	return (
		<Drawer
			className="customer-form"
			destroyOnHidden
			placement="right"
			width={width || '40%'}
			onClose={
				() =>
					// setSupplierAddModal?.(false) ||
					// setAgentAddModal?.(false) ||
					// setStaffsAddModal?.(false) ||
					// setAssetsAddModal?.(false) ||
					// setAccBookAddModal?.(false) ||
					// setAccountBookModal?.(false) ||
					// setItemsAddModal?.(false) ||
					// setVehicleAddModal?.(false) ||
					// setClassAddModal?.(false) ||
					// setVendorAddModal?.(false) ||
					// setCredentialAddModal?.(false) ||
					setCustomerAddModal?.(false) || setCategoryAddModal?.(false) || setItemGroupAddModal?.(false) || setVoucherHeadModal?.(false)
				// handleClose?.()
			}
			open={customerAddModal || accBookAddModal || accountBookModal || vehicleAddModal || salesPersonAddModal || categoryAddModal || itemGroupAddModal || subCategoryAddModal || voucherHeadModal}>
			{customerAddModal && <AddCustomer {...{ handleClose, editCustomer, setCustomerAddModal }} />}
			{/* {vehicleAddModal && <AddVehicle {...{ handleClose, setVehicleAddModal, editVehicle }} />} */}
			{accBookAddModal && <AddAccountBook {...{ handleClose, editAccountBooks, setAccBookAddModal }} />}
			{accountBookModal && <AddVoucher {...{ handleClose, editVoucher, setAccountBookModal }} />}
			{salesPersonAddModal && <AddSalesPerson {...{ handleClose, editSalesPerson, setSalesPersonAddModal }} />}
			{categoryAddModal && <AddCategory {...{ handleClose, editCategories, setCategoryAddModal }} />}
			{itemGroupAddModal && <AddItemGroup {...{ handleClose, editItemGroups, setItemGroupAddModal }} />}
			{subCategoryAddModal && <AddSubCategory {...{ handleClose, editSubCategory, setSubCategoryAddModal, selectedCategory }} />}
			{voucherHeadModal && <AddVoucherHead {...{ handleClose, editVoucherHead, setVoucherHeadModal }} />}
		</Drawer>
	);
};

export default AddDrawer;
