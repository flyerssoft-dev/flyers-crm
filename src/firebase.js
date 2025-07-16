import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, onMessage, isSupported } from 'firebase/messaging';

// const firebaseConfig = {
// 	// apiKey: process.env.REACT_APP_API_KEY,
// 	// authDomain: process.env.REACT_APP_AUTH_DOMAIN,
// 	// projectId: process.env.REACT_APP_PROJECT_ID,
// 	// storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
// 	// messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
// 	// appId: process.env.REACT_APP_APP_ID
// 	apiKey: 'AIzaSyBKYhkUJjFcmdknQYWlaysJQMbTlkVSSUs',
// 	authDomain: 'fir-push-notifications-3b805.firebaseapp.com',
// 	projectId: 'fir-push-notifications-3b805',
// 	storageBucket: 'fir-push-notifications-3b805.appspot.com',
// 	messagingSenderId: '648487200750',
// 	appId: '1:648487200750:web:86a50acaf7b23ed66590ff',
// };

const firebaseConfig = {
	apiKey: "AIzaSyDIr9D7MSn6etWouWVBD1KsvVTPCMHt5rU",
	authDomain: "zopay-books.firebaseapp.com",
	databaseURL: "https://zopay-books-default-rtdb.firebaseio.com",
	projectId: "zopay-books",
	storageBucket: "zopay-books.appspot.com",
	messagingSenderId: "239108367992",
	appId: "1:239108367992:web:ece489ac2c41013187af8d",
	measurementId: "G-TMF0Z37ZW0"
};

console.log('*** Environment ***', process.env.REACT_APP_ENV);
// console.log('*** Firebase Config ***', firebaseConfig);

export const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getOrRegisterServiceWorker = () => {
	if ('serviceWorker' in navigator) {
		return window.navigator.serviceWorker.getRegistration('/firebase-push-notification-scope').then((serviceWorker) => {
			if (serviceWorker) return serviceWorker;
			return window.navigator.serviceWorker.register('/firebase-messaging-sw.js', {
				scope: '/firebase-push-notification-scope',
			});
		});
	}
	throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = async () => {
	const hasFirebaseMessagingSupport = await isSupported();
	// console.log('🚀 ~ file: firebase.js~ hasFirebaseMessagingSupport:', hasFirebaseMessagingSupport);
	if (hasFirebaseMessagingSupport) {
		return getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
			getToken(messaging, {
				vapidKey: 'BNzOVB36eYxtYyNkCfG2V8OwCfwRxgOAdeuEnP6FXaI1J73QaoKW3e4Ng2mCK8yswjZtcliCemPAvslI6obP9gk', //got from firebase Web Push certificates section
				// vapidKey: 'BMfUcxTyBTbHt0eqUjpNrmFC3BolLX90wwblkHwrITU9Yy-OipRmO3n9A6X7sq4IEGuq5PRb6e-ZijamaM4jkHk',
				serviceWorkerRegistration,
			})
		);
	} else return null;
};

export const onForegroundMessage = () =>
	new Promise((resolve) =>
		onMessage(messaging, (payload) => {
			// console.log("🚀 ~ file: firebase.js:46 ~ newPromise ~ payload:", payload)
			return resolve(payload);
		})
	);

export const onMessageListener = async () =>
	new Promise((resolve) =>
		(async () => {
			const messagingResolve = await messaging;
			onMessage(messagingResolve, (payload) => {
				// console.log('On message: ', messaging, payload);
				resolve(payload);
			});
		})()
	);
