
function setCustomers(data){
    return{
        type : "SET_CUSTOMERS",
        payload : data
    }
}

function setSelectedCustomer(data){
    return{
        type : "SET_SELECTED_CUSTOMER",
        payload : data
    }
}


export {  
    setCustomers,
    setSelectedCustomer,
}