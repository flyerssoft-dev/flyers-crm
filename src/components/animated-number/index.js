import React from 'react';
import CountUp from 'react-countup';

const AnimatedNumber = ({ value }) => {
	return <CountUp end={value} duration={0.2} />;
};

export default AnimatedNumber;
