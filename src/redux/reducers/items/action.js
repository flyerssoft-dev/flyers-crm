
function setItems(data){
    return{
        type : "SET_ITEMS",
        payload : data
    }
}

function setSelectedItem(data){
    return{
        type : "SET_SELECTED_ITEM",
        payload : data
    }
}


export {  
    setItems,
    setSelectedItem,
}