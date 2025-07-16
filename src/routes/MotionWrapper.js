// components/MotionWrapper.jsx
import React from 'react';
import { motion } from 'framer-motion';

const MotionWrapper = ({ children }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			transition={{ duration: 0.3, ease: 'easeInOut' }}
		>
			{children}
		</motion.div>
	);
};

export default MotionWrapper;
