import React from 'react';
import AddVoucherFunctional from './components/add-voucher-functional';
import './styles.scss';

const AddVoucher = ({ state, setState, refreshList }) => {
	return <AddVoucherFunctional {...{ state, setState, refreshList }} />;
};

export default AddVoucher;
