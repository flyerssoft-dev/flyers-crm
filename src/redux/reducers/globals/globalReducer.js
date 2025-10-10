let initialState = {
  apiStatus: {},
  accountBooks: [],
  accountBooksData: {},
  salesPersons: [],
  vouchers: [],
  organizations: [],
  selectedOrganization: null,
  currentPage: "1",
  currentPageTitle: "Dashboard",
  states: [],
  users: [],
  classes: [],
  assets: [],
  vehicles: [],
  vendors: [],
  batches: [],
  activeBatch: null,
  partNumbers: [],
  credentials: [],
  categories: [],
  subCategories: [],
  itemGroups: [],
  tags: [],
  taxes: [],
  units: [],
  sizes: [],
};

const globalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGOUT": {
      return initialState;
    }
    case "SET_API_STATUS":
      return {
        ...state,
        apiStatus: {
          ...state.apiStatus,
          ...action.payload,
        },
      };
    case "SET_ORGANIZATIONS":
      return {
        ...state,
        organizations: action.payload,
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload.currentPage,
        currentPageTitle: action.payload.currentPageTitle,
      };
    case "SET_SELECTED_ORGANIZATION":
      return {
        ...state,
        selectedOrganization: action.payload,
      };
    case "SET_ACCOUNT_BOOKS":
      return {
        ...state,
        accountBooks: action.payload,
      };

    case "SET_ACCOUNT_BOOKS_BY_ID":
      return {
        ...state,
        accountBooksData: action.payload,
      };
    case "SET_SALES_PERSONS":
      return {
        ...state,
        salesPersons: action.payload,
      };
    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
      };
    case "SET_SUB_CATEGORIES":
      return {
        ...state,
        subCategories: action.payload,
      };
    case "SET_ITEM_GROUPS":
      return {
        ...state,
        itemGroups: action.payload,
      };
    case "SET_TAGS":
      return {
        ...state,
        tags: action.payload,
      };
    case "SET_TAXES":
      return {
        ...state,
        taxes: action.payload,
      };
    case "SET_STATES":
      return {
        ...state,
        states: action.payload,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "SET_CLASSES":
      return {
        ...state,
        classes: action.payload,
      };
    case "SET_VOUCHERS_HEAD":
      return {
        ...state,
        vouchers: action.payload,
      };
    case "SET_ASSETS":
      return {
        ...state,
        assets: action.payload,
      };
    case "SET_VEHICLES":
      return {
        ...state,
        vehicles: action.payload,
      };
    case "SET_VENDORS":
      return {
        ...state,
        vendors: action.payload,
      };
    case "SET_CREDENTIALS":
      return {
        ...state,
        credentials: action.payload,
      };
    case "SET_PART_NUMBERS":
      return {
        ...state,
        partNumbers: action.payload,
      };
    case "SET_BATCHES":
      return {
        ...state,
        batches: action.payload,
        activeBatch: action.payload.find((batch) => batch.isActive)?._id,
      };
    case "SET_UNITS":
      return {
        ...state,
        units: action.payload,
      };
    case "SET_SIZES":
      return {
        ...state,
        sizes: action.payload,
      };
    default:
      return state;
  }
};

export { globalReducer };
