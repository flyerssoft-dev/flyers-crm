const isProd = process.env.NODE_ENV === 'production';

export const log = (...args) => {
	if (!isProd) console.log(...args);
};

export const warn = (...args) => {
	if (!isProd) console.warn(...args);
};

export const error = (...args) => {
	if (!isProd) console.error(...args);
};
