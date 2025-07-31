function setContact(data) {
  return {
    type: "GET_CONTACT",
    payload: data,
  };
}

function setContactById(data) {
  return {
    type: "GET_CONTACT_BY_ID",
    payload: data,
  };
}

export { setContact, setContactById };
