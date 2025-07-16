import React from 'react';
import Lottie from 'react-lottie';
import LottieFile from 'assets/lottie-files';

const defaultOptions = {
	loop: true,
	autoplay: true,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const LottieComponent = ({
	width = '100%',
	height = '100%',
	loop = true,
	file = LottieFile.HeartLoading,
	isPaused = false,
	autoplay = true,
	...rest
}) => {
	return (
		<Lottie
			isClickToPauseDisabled={true}
			options={{ ...defaultOptions, autoplay, animationData: file, loop }}
			isPaused={isPaused}
			width={width}
			height={height}
			{...rest}
		/>
	);
};

export default LottieComponent;
