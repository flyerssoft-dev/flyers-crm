import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { getMessaging, onMessage } from "firebase/messaging";
import NetworkDetect from "components/network-detect";
import { showToast } from "helpers";
import { AppContextProvider } from "contexts/app-context";
import Routes from "./routes/Routes";
import { firebaseApp, getFirebaseToken } from "./firebase";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";
import "./css/custom.scss";
import "./css/theme.scss";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const messaging = getMessaging(firebaseApp);

function App() {
  useEffect(() => {
    if (Notification.permission === "granted") {
      handleGetFirebaseToken();
    }
    onMessage(messaging, (payload) => {
      console.log("🚀 ~ file: firebase.js:46 ~ newPromise ~ payload:", payload);
      // const {
      // notification: { title, body },
      // } = payload;
      showToast(
        "Did you know?",
        "Here is something that you might like to know."
      );
      // toast(<ToastifyNotification title={title} body={body} />);
    });
    // onForegroundMessage()
    // 	.then((payload) => {
    // 		console.log('Received foreground message: ', payload);
    // 		const {
    // 			notification: { title, body },
    // 		} = payload;
    // 		toast(<ToastifyNotification title={title} body={body} />);
    // 	})
    // 	.catch((err) => console.log('An error occured while retrieving foreground message. ', err));
  });

  const handleGetFirebaseToken = () => {
    getFirebaseToken()
      .then((firebaseToken) => {
        console.log("Firebase token: ", firebaseToken);
        if (firebaseToken) {
          // setShowNotificationBanner(false);
        }
      })
      .catch((err) =>
        console.error("An error occured while retrieving firebase token. ", err)
      );
  };

  // const colors1 = ['#6253E1', '#04BEFE'];
  // const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];
  // const colors3 = ['#40e495', '#30dd8a', '#2bb673'];
  // const getHoverColors = (colors) => colors.map((color) => new TinyColor(color).lighten(5).toString());
  // const getActiveColors = (colors) => colors.map((color) => new TinyColor(color).darken(5).toString());
  console.log("API URL:", process.env.REACT_APP_API_URL);
  return (
    <AppContextProvider>
      <ConfigProvider
        theme={{
          hashed: false,
          token: {
            colorPrimary: "#006fd9",
            borderRadius: 4,
            fontFamily: "Open Sans, sans-serif",
            fontSize: 14,
          },
        }}
      >
        <NetworkDetect />
        <Routes />
        <Toaster />
        <ToastContainer hideProgressBar style={{ width: "400px" }} />
      </ConfigProvider>
    </AppContextProvider>
  );
}

export default App;
