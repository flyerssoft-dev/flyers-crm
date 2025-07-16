import React from 'react';
import {  Row, Col, Skeleton } from 'antd';
import { useSelector } from 'react-redux';
import { API_STATUS } from 'constants/app-constants';
import ImageGallery from 'components/image-gallery';


const Images = () => {
	const ticketRedux = useSelector((state) => state.ticketRedux);
	const globalRedux = useSelector((state) => state.globalRedux);

	const { images } = ticketRedux?.ticketDetails || {};

	const loading = globalRedux.apiStatus.GET_TICKETS_DETAILS === API_STATUS.PENDING;

	// useEffect(() => {
	// 	fetch('https://dummyjson.com/products')
	// 		.then((res) => res.json())
	// 		.then((res) => {
	// 			setDataSource(res?.products);
	// 		});
	// }, []);

	return (
		<Row className="images_container">
			<Col span={24}>
				{loading ? (
					<Col>
						<Skeleton active />
					</Col>
				) : (
					<ImageGallery loading={loading} images={images} />
				)}
			</Col>
		</Row>
	);
};

export default Images;
