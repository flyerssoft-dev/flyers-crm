let initialState = {
  users: [],
  selectedUser: null,
  userDetails: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "SET_SELECTED_USER":
      return {
        ...state,
        selectedUser: action.payload,
      };
    case "GET_USER_DETAILS":
      return {
        ...state,
        userDetails: action.payload,
      };

    default:
      return state;
  }
};

export { userReducer };
