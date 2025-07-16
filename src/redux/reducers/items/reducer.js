let initialState = {
    items : [],
    selectedItem : null,
};

const itemReducer = (state = initialState, action) => {

  switch (action.type) {
  
    case "SET_ITEMS" : 
      return {
        ...state,
        items : action.payload
      }   

    case "SET_SELECTED_ITEM" : 
      return {
        ...state,
        selectedItem : action.payload
      }      

    default : return state
  }

}

export {itemReducer}
