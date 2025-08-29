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

function setContactHistory(data) {
  return {
    type: "GET_CONTACT_HISTORY",
    payload: data,
  };
}

function setPhoneNumbers(data) {
  return {
    type: "GET_PHONE_NUMBERS",
    payload: data,
  };
}

function assignedContacts(data) {
  return {
    type: "GET_USER_CONTACT",
    payload: data,
  };
}
export { setContact, setContactById,setContactHistory,setPhoneNumbers,assignedContacts };
