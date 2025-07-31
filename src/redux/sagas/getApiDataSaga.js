import { call, takeEvery, put } from "redux-saga/effects";
import { setDashboardData } from "redux/reducers/dashboard/dashboardAction";
import { setDailyTransaction } from "redux/reducers/daily-transaction/dailyTransactionAction";
import { setProduction } from "redux/reducers/production/productionAction";
import { setInvoices } from "redux/reducers/invoices/invoiceAction";
import { setCustomers } from "../reducers/customers/customerAction";
import { setSuppliers } from "../reducers/suppliers/supplierAction";
import { ACTIONS } from "../../constants/app-constants";
import { store } from "../store";
import { RESTCallError, sendGetRequest } from "./utils";
import {
  setApiStatus,
  setOrganizations,
  setAccountBooks,
  setClasses,
  setAssets,
  setBatch,
  setVoucherHead,
  setVehicles,
  setPartNumbers,
  setStates,
  setVendors,
  setCredentials,
  setUsers,
  setSalesPerson,
  setCategories,
  setUnits,
  setTags,
  setTaxes,
  setSizes,
  setSubCategories,
  setItemGroups,
  setAccountBooksById,
} from "../reducers/globals/globalActions";
import { setItems } from "../reducers/items/action";
import {
  setProjectDetails,
  setProjects,
  setSelectedProject,
} from "../reducers/projects/action";
import { setAgents } from "../reducers/agent/agentAction";
import { setStudents } from "redux/reducers/students/studentsActions";
// import { setReceipts } from 'redux/reducers/receipts/receiptsActions';
import { setVouchers } from "redux/reducers/vouchers/voucherAction";
import { setStudentsFees } from "redux/reducers/studentFees/studentFeesActions";
import { setLoadIn } from "redux/reducers/load-in/loadInActions";
import { setServiceTrips } from "redux/reducers/service-trips/serviceTripsAction";
import {
  setTicketDetails,
  setTickets,
} from "redux/reducers/tickets/ticketAction";
import { setOrders } from "redux/reducers/orders/ordersActions";
import { setTasks } from "redux/reducers/tasks/tasksActions";
import { setPayments } from "redux/reducers/payments/paymentAction";
import { setIndividulLeads, setLeads } from "redux/reducers/leads/leadAction";
import { setPurchases } from "redux/reducers/purchases/purchaseAction";
import { setStocks } from "redux/reducers/stocks/stocksActions";
import { setInventories } from "redux/reducers/inventory/inventoryAction";
import { setSchedulers } from "redux/reducers/schedulers/schedulerAction";
import { setComposites } from "redux/reducers/composites/compositeAction";
import { setEstimates } from "redux/reducers/estimates/estimatesActions";
import { setTaxInvoices } from "redux/reducers/tax-invoices/taxInvoicesAction";
import { setReceipts } from "redux/reducers/receipts/receiptsActions";
import { loginUserDetails } from "redux/reducers/login/loginActions";
import {
  setContact,
  setContactById,
} from "redux/reducers/contact/contactAction";
import { setDeals, setIndividulDeal } from "redux/reducers/deals/dealAction";

function getApi(apiName, url, extras) {
  return {
    type: "GET_API_DATA",
    apiName: apiName,
    url: url,
    extras: extras,
  };
}

function* getApiDataSaga() {
  yield takeEvery("GET_API_DATA", getApiDataWorker);
}

function* getApiDataWorker(param) {
  let url = param.url;
  let apiName = param.apiName;
  try {
    store.dispatch(setApiStatus(apiName, "PENDING"));
    const result = yield call(sendGetRequest, apiName, url);
    if (result.status === 200) {
      yield getApiDataSuccess(result.data, apiName, param.extras);
    } else if (result.status === "Error") {
      RESTCallError(result, apiName);
    }
  } catch (error) {}
}

function* getApiDataSuccess(response, apiName, extras) {
  switch (apiName) {
    case "GET_ALL_ORGANIZATION":
      yield put(setOrganizations(response?.message || []));
      break;
    case "GET_ALL_PROJECTS":
      yield put(setProjects(response?.data || []));
      break;
    case "GET_PROJECT_BY_ID":
      yield put(setSelectedProject(response));
      break;
    case "GET_CUSTOMERS":
      yield put(setCustomers(response?.data || []));
      break;
    case "GET_SCHEDULERS":
      yield put(setSchedulers(response?.data || []));
      break;
    case "GET_PURCHASES":
      yield put(setPurchases(response?.data || []));
      break;
    case "GET_TAX_INVOICES":
      yield put(setTaxInvoices(response?.data || []));
      break;
    case "GET_COMPOSITES":
      yield put(setComposites(response?.data || []));
      break;
    case "GET_INVENTORIES":
      yield put(setInventories(response?.data || []));
      break;
    case "GET_PAYMENTS":
      yield put(setPayments(response?.data || []));
      break;
    case "GET_RECEIPTS":
      yield put(setReceipts(response?.data || []));
      break;
    case "GET_UNITS":
      yield put(setUnits(response?.data || []));
      break;
    case "GET_SIZES":
      yield put(setSizes(response?.data || []));
      break;
    case "GET_SERVICE_TRIPS":
      yield put(setServiceTrips(response?.data || []));
      break;
    case "GET_SUPPLIERS":
      yield put(setSuppliers(response?.data || []));
      break;
    case "GET_LEADS":
      yield put(setLeads(response?.data || []));
      break;
    case "GET_LEADS_BY_ID":
      yield put(setIndividulLeads(response?.data || []));
      break;
    case "GET_CONTACT":
      yield put(setContact(response?.data || []));
      break;
    case "GET_CONTACT_BY_ID":
      yield put(setContactById(response?.data || []));
      break;
    case "GET_DEALS":
      yield put(setDeals(response?.data || []));
      break;
    case "GET_DEAL_BY_ID":
      yield put(setIndividulDeal(response?.data || []));
      break;
    case "GET_ITEMS":
      yield put(setItems(response?.data || []));
      break;
    case "GET_PROJECTS":
      yield put(setProjects(response?.data || []));
      break;
    case "GET_CLASSES":
      yield put(setClasses(response?.data || []));
      break;
    case "GET_SUB_ITEMS":
      yield put(setItems(response?.data || []));
      break;
    case "GET_AGENTS":
      yield put(setAgents(response?.data || []));
      break;
    case "GET_DAILY_TRANSACTION_LIST":
      yield put(setDailyTransaction(response?.data || []));
      break;
    case "GET_PRODUCTION_LIST":
      yield put(setProduction(response?.data || []));
      break;
    case "GET_INVOICES":
      yield put(setInvoices(response?.data || []));
      break;
    case "GET_VOUCHERS_HEAD":
      yield put(setVoucherHead(response?.data || []));
      break;
    case ACTIONS.GET_ACCOUNT_BOOKS:
      yield put(setAccountBooks(response?.data || []));
      break;
    case "GET_ACCOUNT_BOOKS_BY_ID":
      yield put(setAccountBooksById(response?.data || []));
      break;
    case ACTIONS.GET_SALES_PERSONS:
      yield put(setSalesPerson(response?.data || []));
      break;
    case "GET_CATEGORIES":
      yield put(setCategories(response?.data || []));
      break;
    case "GET_SUB_CATEGORIES":
      yield put(setSubCategories(response?.data || []));
      break;
    case "GET_ITEM_GROUPS":
      yield put(setItemGroups(response?.data || []));
      break;
    case "GET_TAGS":
      yield put(setTags(response?.data || []));
      break;
    case "GET_TAXES":
      yield put(setTaxes(response?.data || []));
      break;
    case "GET_ASSETS":
      yield put(setAssets(response?.data || []));
      break;
    case "GET_VEHICLES":
      yield put(setVehicles(response?.data || []));
      break;
    case "GET_VENDORS":
      yield put(setVendors(response?.data || []));
      break;
    case "GET_CREDENTIALS":
      yield put(setCredentials(response?.data || []));
      break;
    case "GET_PART_NUMBERS":
      yield put(setPartNumbers(response?.data || []));
      break;
    case "GET_USERS":
      yield put(setUsers(response?.users || []));
      break;
    case "GET_TICKETS":
      yield put(setTickets(response?.data || []));
      break;
    case "GET_TICKETS_DETAILS":
      yield put(setTicketDetails(response || {}));
      break;
    case "GET_PROJECTS_DETAILS":
      yield put(setProjectDetails(response || {}));
      break;
    case "GET_STUDENTS":
      yield put(setStudents(response?.data || []));
      break;
    case "GET_STUDENTS_FEES":
      yield put(setStudentsFees(response?.data || []));
      break;
    case "GET_VOUCHERS":
      yield put(setVouchers(response?.data || []));
      break;
    case "GET_ORDERS":
      yield put(setOrders(response?.data || []));
      break;
    case "GET_ESTIMATES":
      yield put(setEstimates(response?.data || []));
      break;
    case "GET_TASKS":
      yield put(setTasks(response?.data || []));
      break;
    case "GET_STOCKS":
      yield put(setStocks(response?.data || []));
      break;
    case "GET_LOAD_IN":
      yield put(setLoadIn(response?.data || []));
      break;
    case "GET_BATCHES":
      yield put(setBatch(response?.data || []));
      break;
    case "GET_DASHBOARD_DATA":
      yield put(setDashboardData(response || []));
      break;
    case "GET_STATES":
      yield put(setStates(response?.data || []));
      break;
    case "PROFILE_API":
      yield put(loginUserDetails(response || {}));
      break;
    default:
      break;
  }
  yield put(setApiStatus(apiName, "SUCCESS"));
}

export { getApi, getApiDataSaga };
