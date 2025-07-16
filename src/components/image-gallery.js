import React from 'react';
import { List, Card, Image } from 'antd';
import { SERVER_IP } from 'assets/Config';

const { Meta } = Card;

const ImageGallery = ({ images = [], loading }) => {
	const [activeIndex, setActiveIndex] = React.useState(null);
	// const [previewImages, setPreviewImages] = React.useState([]);

	return (
		<>
			<List
				loading={loading}
				dataSource={images}
				grid={{
					xs: 1,
					sm: 2,
					md: 3,
					lg: 4,
					xl: 5,
					xxl: 6,
				}}
				renderItem={(item, index) => (
					<Card
						key={item?.id}
						hoverable
						style={{
							margin: 10,
							// height: 300,
						}}
						// cover={
						// 	<img
						// 		style={{
						// 			height: 120,
						// 		}}
						// 		alt="example"
						// 		src={`${SERVER_IP}/${item?.path}`}
						// 	/>
						// }
					>
						<Image
							preview={{
								visible: false,
							}}
							style={{
								height: 120,
								width: '100%',
							}}
							onClick={() => setActiveIndex(index)}
							src={`${SERVER_IP}/${item?.path}`}
						/>
						<Meta
							title={item?.filename}
							// description="www.instagram.com"
						/>
					</Card>
				)}
			/>
			{activeIndex !== null ? (
				<Image.PreviewGroup
                preview={{
                        className:"gallery-class",
                        visible: activeIndex !== null,
                        // current: activeIndex,
						onVisibleChange: (value) => {
							if (!value) {
								setActiveIndex(null);
							}
						},
						onChange: (value) => {
							setActiveIndex(value);
						},
					}}>
					{images?.map((image) => (
						<Image className="preview-image" src={`${SERVER_IP}/${image?.path}`} />
					))}
				</Image.PreviewGroup>
			) : null}
		</>
	);
};

export default ImageGallery;
