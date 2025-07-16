import React, { useCallback } from 'react';
import { Drawer } from 'antd';
import AddAsset from 'pages/master-component/AddAsset';
import AddAccountBook from 'pages/master-component/AddAccountBook';
import AddVoucher from 'pages/master-component/AddVoucher';
// import AddVehicle from 'pages/master-component/AddVehicle';
import AddVendor from 'pages/master-component/AddVendor';
import AddCredential from 'pages/master-component/AddCredential';
import AddCustomer from 'pages/master-component/AddCustomer';
// import { ExclamationCircleOutlined } from '@ant-design/icons';

const AddDrawer = ({
	width,
	supplierAddModal,
	setSupplierAddModal = null,
	agentAddModal,
	setAgentAddModal = null,
	getAgents = null,
	refreshList,
	staffsAddModal,
	setStaffsAddModal,
	getStaffs,
	assetsAddModal,
	setAssetsAddModal,
	getAssets,
	editAsset,
	editVehicle,
	accBookAddModal,
	setAccBookAddModal,
	getAccountBooks,
	editAccountBooks,
	accountBookModal,
	setAccountBookModal,
	getVouchers,
	editVoucher,
	itemsAddModal,
	setItemsAddModal,
	vehicleAddModal,
	setVehicleAddModal,
	getVehicle,
	setClassAddModal,
	getClass,
	editClass,
	getItems,
	vendorAddModal,
	setVendorAddModal,
	getVendor,
	editVendor,
	credentialAddModal,
	setCredentialAddModal,
	getCredential,
	editCredential,
	customerAddModal,
	setCustomerAddModal,
	getCustomers,
	editCustomer,
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
		getItems?.();
		getVehicle?.();
		getClass?.();
		getVendor?.();
		getCredential?.();
		getCustomers?.();
	};
	return (
		<Drawer
			className="customer-form"
			destroyOnHidden
			placement="right"
			width={width || '40%'}
			// onClose={() =>
			// 	setSupplierAddModal?.(false) ||
			// 	setAgentAddModal?.(false) ||
			// 	setStaffsAddModal?.(false) ||
			// 	setAssetsAddModal?.(false) ||
			// 	setAccBookAddModal?.(false) ||
			// 	setAccountBookModal?.(false) ||
			// 	setItemsAddModal?.(false) ||
			// 	setVehicleAddModal?.(false) ||
			// 	setClassAddModal?.(false) ||
			// 	setVendorAddModal?.(false) ||
			// 	setCredentialAddModal?.(false) ||
			// 	setCustomerAddModal?.(false)
			// }
			open={
				customerAddModal ||
				supplierAddModal ||
				agentAddModal ||
				staffsAddModal ||
				assetsAddModal ||
				accBookAddModal ||
				accountBookModal ||
				itemsAddModal ||
				vehicleAddModal ||
				vendorAddModal ||
				credentialAddModal
			}>
			{customerAddModal && <AddCustomer {...{ handleClose, editCustomer, setCustomerAddModal }} />}
			{assetsAddModal && <AddAsset {...{ handleClose, editAsset, setAssetsAddModal }} />}
			{/* {vehicleAddModal && <AddVehicle {...{ handleClose, setVehicleAddModal, editVehicle }} />} */}
			{vendorAddModal && <AddVendor {...{ handleClose, setVendorAddModal, editVendor }} />}
			{credentialAddModal && <AddCredential {...{ handleClose, setCredentialAddModal, editCredential }} />}
			{accBookAddModal && <AddAccountBook {...{ handleClose, editAccountBooks, setAccBookAddModal }} />}
			{accountBookModal && <AddVoucher {...{ handleClose, editVoucher, setAccountBookModal }} />}
		</Drawer>
	);
};

export default AddDrawer;
