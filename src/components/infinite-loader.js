import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';

const InfiniteLoader = () => {
	return <InfinitySpin visible={true} width="180" color="#4fa94d" ariaLabel="infinity-spin-loading" />;
};

export default InfiniteLoader;
