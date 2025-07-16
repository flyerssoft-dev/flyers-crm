import { AiFillCheckCircle, AiFillInfoCircle, AiFillWarning, AiFillCloseCircle } from 'react-icons/ai';

// showToast('Did you know?', 'Here is something that you might like to know.');
export const ToastifyNotification = ({ type, title, body }) => {
	const IconType = {
		INFO: <AiFillInfoCircle />,
		WARNING: <AiFillWarning />,
		ERROR: <AiFillCloseCircle />,
		SUCCESS: <AiFillCheckCircle />,
	};

	const Icon = IconType[type];
	return (
		<div className={`push-notification ${type}`}>
			<div className="indicator" />
			<div className="icon">{Icon}</div>
			<div className="push-notification-content">
				<span className="push-notification-title">{title}</span>
				<p className="push-notification-text">{body}</p>
			</div>
		</div>
	);
};

/* <div className="Toastify">
    <div className="Toastify__toast-container Toastify__toast-container--top-right">
        <div id="1" className="Toastify__toast Toastify__toast-theme--light Toastify__toast--default Toastify__toast--close-on-click">
            <div role="alert" className="Toastify__toast-body">
                <div>
                    <div className="push-notification">
                        <div className="indicator" />
                        <div className="icon">
                            <AiFillInfoCircle />
                        </div>
                        <div className="push-notification-content">
                            <span className="push-notification-title">Did you know?</span>
                            <p className="push-notification-text">Here is something that you might like to know.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div> */

