import { all } from "redux-saga/effects";

let initialState = {
  contact: [],
  contactData: {},
  contactHistory: [],
  phoneNumbers: [],
  assginedContacts:[],
  callNotes:[],
  allContacts: []
};

const contactReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CONTACT":
      return {
        ...state,
        contact: action.payload,
      };

    case "GET_CONTACT_BY_ID":
      return {
        ...state,
        contactData: action.payload,
      };

    case "GET_CONTACT_HISTORY":
      return {
        ...state,
        contactHistory: action.payload,
      };
    case "GET_PHONE_NUMBERS":
      return {
        ...state,
        phoneNumbers: action.payload,
      };
    case "GET_USER_CONTACT":
       return {
        ...state,
        assginedContacts: action.payload,
      };
    case "GET_CALL_NOTES":
      return {
        ...state,
        callNotes: action.payload,
      };
    case "GET_CONTACT_ALL":
      return {
        ...state,
        allContacts: action.payload,
      };
    default:
      return state;
  }
};

export { contactReducer };
