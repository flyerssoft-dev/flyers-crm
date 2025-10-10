import { combineReducers } from "redux";
import storageSession from "redux-persist/lib/storage/session";
import { persistReducer } from "redux-persist";
import { globalReducer } from "./globals/globalReducer";
import { loginReducer } from "./login/loginReducer";
import { customerReducer } from "./customers/customerReducer";
import { projectReducer } from "./projects/reducer";
import { userReducer } from "./users/reducer";
import { itemReducer } from "./items/reducer";
import { voucherReducer } from "./vouchers/voucherReducer";
import { agentReducer } from "./agent/agentReducer";
import { subItemReducer } from "./sub-items/reducer";
import { invoiceReducer } from "./invoices/invoiceReducer";
import { dashboardReducer } from "./dashboard/dashboardReducer";
import { staffReducer } from "./staffs/staffReducer";
import { purchasesReducer } from "./purchases/purchasesReducer";
import { AccBooksReducer } from "./accBooks/accBookReducer";
import { dailyTransactionReducer } from "./daily-transaction/dailyTransactionReducer";
import { StudentsReducer } from "./students/studentsReducer";
import { ReceiptsReducer } from "./receipts/receiptsReducer";
import { StudentsFeesReducer } from "./studentFees/studentFeesReducer";
import { LoadInReducer } from "./load-in/loadInReducer";
import { ticketReducer } from "./tickets/ticketReducer";
import { registerReducer } from "./register/registerReducer";
import { supplierReducer } from "./suppliers/supplierReducer";
import { serviceTripsReducer } from "./service-trips/serviceTripsReducer";
import { OrdersReducer } from "./orders/ordersReducer";
import { TasksReducer } from "./tasks/tasksReducer";
import { paymentReducer } from "./payments/paymentReducer";
import { leadsReducer } from "./leads/leadReducer";
import { StocksReducer } from "./stocks/stocksReducer";
import { inventoriesReducer } from "./inventory/inventoryReducer";
import { schedulerReducer } from "./schedulers/schedulerReducer";
import { compositesReducer } from "./composites/compositeReducer";
import { EstimatesReducer } from "./estimates/estimatesReducer";
import { taxInvoicesReducer } from "./tax-invoices/taxInvoicesReducer";
import { contactReducer } from "./contact/contactReducer";
import { dealReducer } from "./deals/dealReducer";
import { callReducer } from "./call/callReducer";

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const allReducers = combineReducers({
  loginRedux: loginReducer,
  registerRedux: registerReducer,
  globalRedux: globalReducer,
  customerRedux: customerReducer,
  schedulerRedux: schedulerReducer,
  compositesRedux: compositesReducer,
  paymentRedux: paymentReducer,
  // unitRedux: unitReducer,
  serviceTripsRedux: serviceTripsReducer,
  supplierRedux: supplierReducer,
  leadsRedux: leadsReducer,
  projectRedux: projectReducer,
  userRedux: userReducer,
  itemRedux: itemReducer,
  agentRedux: agentReducer,
  voucherRedux: voucherReducer,
  dashboardRedux: dashboardReducer,
  subItemRedux: subItemReducer,
  invoicesRedux: invoiceReducer,
  purchasesRedux: purchasesReducer,
  inventoriesRedux: inventoriesReducer,
  staffRedux: staffReducer,
  accBookRedux: AccBooksReducer,
  studentsRedux: StudentsReducer,
  studentsFeesRedux: StudentsFeesReducer,
  receiptsRedux: ReceiptsReducer,
  loadInRedux: LoadInReducer,
  ordersRedux: OrdersReducer,
  estimatesRedux: EstimatesReducer,
  tasksRedux: TasksReducer,
  stocksRedux: StocksReducer,
  dailyTransactionRedux: dailyTransactionReducer,
  ticketRedux: ticketReducer,
  taxInvoicesRedux: taxInvoicesReducer,
  contactRedux: contactReducer,
  dealsRedux: dealReducer,
  callRedux: callReducer
});

export default persistReducer(persistConfig, allReducers);
