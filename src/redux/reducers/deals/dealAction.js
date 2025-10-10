function setDeals(data) {
  return {
    type: "GET_DEALS",
    payload: data,
  };
}

function setIndividulDeal(data) {
  return {
    type: "GET_DEAL_BY_ID",
    payload: data,
  };
}

export { setDeals, setIndividulDeal };
