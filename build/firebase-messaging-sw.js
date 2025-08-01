importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.20.0/firebase-messaging-compat.js');

const firebaseConfig = {
	apiKey: "AIzaSyBKYhkUJjFcmdknQYWlaysJQMbTlkVSSUs",
	authDomain: "fir-push-notifications-3b805.firebaseapp.com",
	projectId: "fir-push-notifications-3b805",
	storageBucket: "fir-push-notifications-3b805.appspot.com",
	messagingSenderId: "648487200750",
	appId: "1:648487200750:web:86a50acaf7b23ed66590ff",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log("Received background message: ", payload);

	const notificationTitle = payload.notification.title;
	const notificationOptions = { body: payload.notification.body };

	self.registration.showNotification(notificationTitle, notificationOptions);
});
