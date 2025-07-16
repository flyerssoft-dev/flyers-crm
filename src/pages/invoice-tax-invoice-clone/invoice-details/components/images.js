import React, { useEffect, useState } from 'react';
import { List, Image, Card, Row, Col } from 'antd';

const Images = () => {
	const [dataSource, setDataSource] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		fetch('https://dummyjson.com/products')
			.then((res) => res.json())
			.then((res) => {
				setLoading(false);
				setDataSource(res?.products);
			});
	}, []);

	return (
		<Row className="images_container">
			<Col span={24}>
                <List
                    loading={loading}
                    dataSource={dataSource}
                    grid={{
                        xs: 1,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6,
                    }}
                    renderItem={(item) => (
                        <Card
                            key={item?.id}
                            style={{ height: 150, margin: 12 }}
                            >
                            <Image src={item?.thumbnail} />
                        </Card>
                    )}
                />
            </Col>
		</Row>
	);
};

export default Images;
