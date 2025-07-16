function setRegisterStatus(data){
    return {
        type : "SET_REGISTER_STATUS",
        payload : data
    }
}

function setRegisterSuccess(data){
    return {
        type : "SET_REGISTER_SUCCESS",
        payload : data
    }
}

function setUserDetails(data){
    return {
        type : "SET_USER_DETAILS",
        payload : data
    }
}

function setForgotPasswordData(data){
    return {
        type : "SET_FORGOT_PASSWORD_DATA",
        payload : data
    }
}

function resetForgotPasswordData(){
    return {
        type : "SET_FORGOT_PASSWORD_DATA",
        payload : {}
    }
}

function logoutAction(data){
    return {
        type : "LOGOUT",
        payload : data
    }
}


export {
    setRegisterStatus,
    setUserDetails,
    setForgotPasswordData,
    resetForgotPasswordData,
    logoutAction,
    setRegisterSuccess
}