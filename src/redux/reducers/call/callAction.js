function getCallRecordings(data) {
  return {
    type: "GET_CALL_RECORDINGS",
    payload: data,
  };
}

function getCallHistory(data) {
  return {
    type: "GET_CALL_HISTORY",
    payload: data,
  };
}

export { getCallRecordings, getCallHistory };
