function setLeads(data) {
  return {
    type: "SET_LEADS",
    payload: data,
  };
}

function setIndividulLeads(data) {
  return {
    type: "GET_LEADS_BY_ID",
    payload: data,
  };
}
export { setLeads , setIndividulLeads };
