let initialState = {
    customers : [],
    selectedCustomer : null,
};

const customerReducer = (state = initialState, action) => {

  switch (action.type) {

    case "LOGOUT" : {
      return initialState
    }
  
    case "SET_CUSTOMERS" : 
      return {
        ...state,
        customers : action.payload
      }   

    case "SET_SELECTED_CUSTOMER" : 
      return {
        ...state,
        selectedCustomer : action.payload
      }      

    
    default : return state
  }

}

export {customerReducer}
