let initialState = {
  deals: [],
  dealData: {},
};

const dealReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_DEALS":
      return {
        ...state,
        deals: action.payload,
      };
    case "GET_DEAL_BY_ID":
      return {
        ...state,
        dealData: action.payload,
      };
    default:
      return state;
  }
};

export { dealReducer };
