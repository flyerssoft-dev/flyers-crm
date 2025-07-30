
function setDeals(data){
    return{
        type : "GET_DEALS",
        payload : data
    }
}

export {  
    setDeals,
}