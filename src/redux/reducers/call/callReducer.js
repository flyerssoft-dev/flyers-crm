let initialState = {
  call_recordings: [],
  call_history: [],
};

const callReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CALL_RECORDINGS":
      return {
        ...state,
        call_recordings: action.payload,
      };
    case "GET_CALL_HISTORY":
      return {
        ...state,
        call_history: action.payload,
      };
    default:
      return state;
  }
};

export { callReducer };
