import { 
    notification,
} from 'antd';
import React from 'react';
import {MdCancel} from 'react-icons/md';
import {FiSmile} from 'react-icons/fi';
import {ImSad} from 'react-icons/im';
import { SHOW_API_NAME_IN_NOTIFICATION, NOTIFICATION_DURATION } from '../assets/Config';

const POSITION = 'topRight';
const DURATION = NOTIFICATION_DURATION;

function SuccessNotification(title,body,position = POSITION) {
    return (
        notification.success({
            message: SHOW_API_NAME_IN_NOTIFICATION ? title : body,
            description: SHOW_API_NAME_IN_NOTIFICATION ? body : null,
            className:'success-notification',
            id:'success-notification',
            duration : DURATION,
            placement : position,
            closeIcon: <MdCancel style={{fontSize : '24px'}}/>,
            icon : <FiSmile color="green"/>,
            style : {
                border : '2px solid green',
                borderRadius : '20px'
            }
        })
    )
}

function ErrorNotification(title,body,position = POSITION) {
    return (
        notification.error({
            message: SHOW_API_NAME_IN_NOTIFICATION ? title : body,
            description: SHOW_API_NAME_IN_NOTIFICATION ? body : null,
            closeIcon: <MdCancel style={{fontSize : '24px'}}/>,
            className:'error-notification',
            id:'error-notification',
            duration : DURATION,
            placement : position,
            icon : <ImSad color="red"/>,
            style : {
                border : '2px solid red',
                borderRadius : '20px'
            }
        })
    )
}


export {
    SuccessNotification,
    ErrorNotification
};