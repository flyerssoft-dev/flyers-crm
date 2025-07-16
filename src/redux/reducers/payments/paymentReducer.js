let initialState = {
    payments : [],
};

const paymentReducer = (state = initialState, action) => {

  switch (action.type) {
  
    case "SET_PAYMENTS" : 
      return {
        ...state,
        payments : action.payload
      }
    
    default : return state
  }

}

export {paymentReducer}
