import React from "react";
import * as FI from "react-icons/fi";
import * as FA from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import * as MD from "react-icons/md";
import * as RI from "react-icons/ri";

import Board from "pages/board";
import Dashboard from "pages/dashboard";
import StudentsList from "pages/students/students-list";
import Items from "pages/items/Items";
import Master from "pages/master";
import LoadIn from "pages/load-in/load-in-list";
import VoucherList from "pages/voucher/voucher-list";
import TicketList from "pages/tickets/ticket-list";
// import Projects from 'pages/projects';
import CustomerList from 'pages/customers/customer-list';
import UserList from 'pages/users/user-list';
import SuppliersList from 'pages/suppliers/suppliers-list';
import InvoiceList from 'pages/invoice/invoice-list';
import AddInvoice from 'pages/invoice/add-invoice';
import ServiceTripList from 'pages/service-trips/service-trip-list';
import OrdersList from 'pages/orders/orders-list';
import PaymentsList from 'pages/payments/payments-list';
import TasksList from 'pages/tasks/tasks-list';
import InventoryList from 'pages/inventory/inventory-list';
import LeadsList from 'pages/leads/leads-list';
import Settings from 'pages/settings';
import ProfilePage from 'pages/profile/profile-page';
import PurchasesList from 'pages/purchases/purchases-list';
import Preferences from 'pages/preferences';
import StocksList from 'pages/stocks/stocks-list';
import SchedulerList from 'pages/schedulers/scheduler-list';
import CompositeList from 'pages/composites/composites-list';
import ProjectsList from 'pages/projects-new/projects-list';
import ProjectDetail from 'pages/projects-new/project-details';
import EstimatesList from 'pages/estimates/estimates-list';
import TaxInvoiceList from 'pages/tax-invoice/tax-invoice-list';
import ReceiptList from 'pages/receipt/receipt-list';
import AddTaxInvoice from 'pages/tax-invoice/add-tax-invoice';
import CustomerStatementList from 'pages/customer-statement';
import FaqExtractor from 'pages/FaqExtractor';
import ExportInvoiceList from 'pages/export-invoice';
import ExportGstJsonList from 'pages/export-gst-json';
import ContactList from 'pages/contacts/contact-list';
import AccountList from "pages/accounts/accounts-list";

// import * as FA from 'react-icons/fa';
// import { GrVmMaintenance } from 'react-icons/gr';
// import * as FC from 'react-icons/fc';
// import InvoiceList from 'pages/invoice/invoice-list';
// import InvoiceDetail from 'pages/invoice-old/invoice-details';
// import WHInvoice from 'pages/wh-invoice/wh-invoice-list';

// const Board = React.lazy(() => import('pages/board'));
// const Dashboard = React.lazy(() => import('pages/dashboard'));
// const StudentsList = React.lazy(() => import('pages/students/students-list'));
// const Items = React.lazy(() => import('pages/items/Items'));
// const Master = React.lazy(() => import('pages/master'));
// const LoadIn = React.lazy(() => import('pages/load-in/load-in-list'));
// const VoucherList = React.lazy(() => import('pages/voucher/voucher-list'));
// const TicketList = React.lazy(() => import('pages/tickets/ticket-list'));
// const Projects = React.lazy(() => import('pages/projects'));
// const CustomerList = React.lazy(() => import('pages/customers/customer-list'));
// const UserList = React.lazy(() => import('pages/users/user-list'));
// const SuppliersList = React.lazy(() => import('pages/suppliers/suppliers-list'));
// const InvoiceList = React.lazy(() => import('pages/invoice/invoice-list'));
// const AddInvoice = React.lazy(() => import('pages/invoice/add-invoice'));
// const ServiceTripList = React.lazy(() => import('pages/service-trips/service-trip-list'));
// const OrdersList = React.lazy(() => import('pages/orders/orders-list'));
// const PaymentsList = React.lazy(() => import('pages/payments/payments-list'));
// const TasksList = React.lazy(() => import('pages/tasks/tasks-list'));
// const InventoryList = React.lazy(() => import('pages/inventory/inventory-list'));
// const LeadsList = React.lazy(() => import('pages/leads/leads-list'));
// const Settings = React.lazy(() => import('pages/settings'));
// const ProfilePage = React.lazy(() => import('pages/profile/profile-page'));
// const PurchasesList = React.lazy(() => import('pages/purchases/purchases-list'));
// const Preferences = React.lazy(() => import('pages/preferences'));
// const StocksList = React.lazy(() => import('pages/stocks/stocks-list'));
// const SchedulerList = React.lazy(() => import('pages/schedulers/scheduler-list'));
// const CompositeList = React.lazy(() => import('pages/composites/composites-list'));

const API_STATUS = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const ACTIONS = {
  ADD_STUDENT: "ADD_STUDENT",
  ADD_VOUCHER: "ADD_VOUCHER",
  ADD_RECEIPT: "ADD_RECEIPT",
  EDIT_RECEIPT: "ADD_RECEIPT",
  ADD_VOUCHER_HEAD: "ADD_VOUCHER_HEAD",
  EDIT_STUDENT: "EDIT_STUDENT",
  EDIT_VOUCHER: "EDIT_VOUCHER",
  GET_AGENTS: "GET_AGENTS",
  GET_INVOICES: "GET_INVOICES",
  GET_TAX_INVOICES: "GET_TAX_INVOICES",
  GET_STUDENTS: "GET_STUDENTS",
  GET_STUDENTS_FEES: "GET_STUDENTS_FEES",
  GET_VOUCHERS: "GET_VOUCHERS",
  GET_RECEIPTS: "GET_RECEIPTS",
  GET_ORDERS: "GET_ORDERS",
  GET_ESTIMATES: "GET_ESTIMATES",
  GET_PURCHASES: "GET_PURCHASES",
  GET_COMPOSITES: "GET_COMPOSITES",
  GET_INVENTORIES: "GET_INVENTORIES",
  GET_TASKS: "GET_TASKS",
  GET_STOCKS: "GET_STOCKS",
  GET_LOAD_IN: "GET_LOAD_IN",
  GET_VOUCHERS_HEAD: "GET_VOUCHERS_HEAD",
  GET_DASHBOARD_DATA: "GET_DASHBOARD_DATA",
  GET_ITEMS: "GET_ITEMS",
  GET_PROJECTS: "GET_PROJECTS",
  GET_CLASSES: "GET_CLASSES",
  GET_ACCOUNT_BOOKS: "GET_ACCOUNT_BOOKS",
  GET_SALES_PERSONS: "GET_SALES_PERSONS",
  SET_ACCOUNT_BOOKS: "SET_ACCOUNT_BOOKS",
  SET_SALES_PERSONS: "SET_SALES_PERSONS",
  GET_TICKETS: "GET_TICKETS",
  GET_SERVICE_TRIPS: "GET_SERVICE_TRIPS",
  SET_SERVICE_TRIPS: "SET_SERVICE_TRIPS",
  GET_TICKETS_DETAILS: "GET_TICKETS_DETAILS",
  GET_PROJECTS_DETAILS: "GET_PROJECTS_DETAILS",
};

export const DATE_FORMAT = {
  YYYY_MM_DD: "YYYY-MM-DD",
  DD_MM_YYYY: "DD-MM-YYYY",
  MM_DD_YYYY: "MM-DD-YYYY",
};

const SIDE_MENUS = [
  {
    name: "Users",
    icon: <FI.FiUsers />,
    route: "/users",
    key: "1",
  },
  {
    name: "Preferences",
    icon: <FI.FiSettings />,
    route: "/preferences",
    key: "3",
  },
  {
    name: "Settings",
    icon: <FI.FiSettings />,
    route: "/settings",
    key: "2",
  },
  // {
  // 	name: 'Masters',
  // 	icon: <FI.FiSettings />,
  // 	route: '/projects',
  // 	key: '8',
  // },
];

const MENUS = [
  {
    name: "Dashboard",
    icon: <MD.MdDashboard />,
    route: "/",
    key: "1",
  },
  {
    name: "Leads",
    icon: <FI.FiUsers />,
    route: "/leads",
    key: "2",
  },
  {
		name: 'Contacts',
		icon: <FI.FiUsers />,
		route: '/contacts',
		key: '3',
	},
  {
    name: "Accounts",
    icon: <FI.FiUsers />,
    route: "/accounts",
    key: "3",
  },
  {
    name: "Customers",
    icon: <FI.FiUsers />,
    route: "/customers",
    key: "4",
  },
  // {
  // 	name: 'Sales',
  // 	icon: <FI.FiUsers />,
  // 	route: '/sales',
  // 	key: '4',
  // 	submenus: [
  // 		{
  // 			name: 'Estimate',
  // 			icon: <BsBoxSeam />,
  // 			route: '/estimate',
  // 			key: '6',
  // 		},
  // 		{
  // 			name: 'Sales Order',
  // 			icon: <BsBoxSeam />,
  // 			route: '/sales-order',
  // 			key: '7',
  // 		},
  // 		{
  // 			name: 'Invoice',
  // 			icon: <BsBoxSeam />,
  // 			route: '/invoice',
  // 			key: '5',
  // 		},
  // 		{
  // 			name: 'Tax Invoice',
  // 			icon: <BsBoxSeam />,
  // 			route: '/tax-invoice',
  // 			key: '8',
  // 		},
  // 		{
  // 			name: 'Customer Payments',
  // 			icon: <BsBoxSeam />,
  // 			route: '/customer-payments',
  // 			key: '9',
  // 		},
  // 		{
  // 			name: 'Customer statements',
  // 			icon: <BsBoxSeam />,
  // 			route: '/customer-statements',
  // 			key: '25',
  // 		},
  // 		{
  // 			name: 'Export Invoice',
  // 			icon: <BsBoxSeam />,
  // 			route: '/export-invoice',
  // 			key: '26',
  // 		},
  // 		{
  // 			name: 'Export Gst Json',
  // 			icon: <BsBoxSeam />,
  // 			route: '/export-gst-json',
  // 			key: '27',
  // 		},
  // 	],
  // },
  // {
  // 	name: 'Purchases',
  // 	icon: <BsBoxSeam />,
  // 	route: '/purchase',
  // 	key: '10',
  // 	submenus: [
  // 		{
  // 			name: 'Purchases Entry',
  // 			icon: <BsBoxSeam />,
  // 			route: '/purchases',
  // 			key: '11',
  // 		},
  // 		{
  // 			name: 'Vendor Payment',
  // 			icon: <BsBoxSeam />,
  // 			route: '/vendor-payment',
  // 			key: '12',
  // 		},
  // 	],
  // },
  // {
  // 	name: 'Inventory',
  // 	icon: <BsBoxSeam />,
  // 	route: '/inventory',
  // 	key: '13',
  // 	submenus: [
  // 		{
  // 			name: 'Items',
  // 			icon: <BsBoxSeam />,
  // 			route: '/items',
  // 			key: '14',
  // 		},
  // 		{
  // 			name: 'Stocks',
  // 			icon: <BsBoxSeam />,
  // 			route: '/stocks',
  // 			key: '15',
  // 		},
  // 		// {
  // 		// 	name: 'Stock Adjustment',
  // 		// 	icon: <BsBoxSeam />,
  // 		// 	route: '/stock-adjustment',
  // 		// 	key: '24',
  // 		// },
  // 		{
  // 			name: 'Production Entry',
  // 			icon: <BsBoxSeam />,
  // 			route: '/production-entry',
  // 			key: '16',
  // 		},
  // 	],
  // },
  // {
  // 	name: 'Schedulers',
  // 	icon: <FI.FiUsers />,
  // 	route: '/schedulers',
  // 	key: '17',
  // },
  // {
  // 	name: 'Composite',
  // 	icon: <FI.FiUsers />,
  // 	route: '/composites',
  // 	key: '18',
  // },
  // {
  // 	name: 'Tickets',
  // 	icon: <RI.RiBillLine />,
  // 	route: '/tickets',
  // 	key: '19',
  // },
  // {
  // 	name: 'Suppliers',
  // 	icon: <FI.FiUsers />,
  // 	route: '/suppliers',
  // 	key: '20',
  // },
  // {
  // 	name: 'Tasks',
  // 	icon: <MD.MdAddTask />,
  // 	route: '/tasks',
  // 	key: '21',
  // },
  // {
  // 	name: 'Projects',
  // 	icon: <FI.FiSettings />,
  // 	route: '/projects',
  // 	key: '22',
  // },
  // {
  // 	name: 'Voucher',
  // 	icon: <FA.FaReceipt />,
  // 	// icon: <RI.RiBillLine />,
  // 	route: '/voucher',
  // 	key: '23',
  // },
  // {
  // 	name: 'Masters',
  // 	icon: <FI.FiSettings />,
  // 	route: '/masters',
  // 	key: '24',
  // },
];

export const ROUTE_CONSTANTS = {
  NEW_INVOICE: "/invoice/new",
  INVOICE_DETAILS: "/invoice",
  NEW_TAX_INVOICE: "/tax-invoice/new",
  TAX_INVOICE_DETAILS: "/tax-invoice",
};

const ROUTES = [
  // {
  // 	route: '/invoice/:id',
  // 	Component: InvoiceDetail,
  // },
  {
    route: "/invoice/:invoiceId",
    Component: AddInvoice,
  },
  {
    route: "/invoice/new",
    Component: AddInvoice,
  },
  {
    route: "/tax-invoice/:invoiceId",
    Component: AddTaxInvoice,
  },
  {
    route: "/tax-invoice/new",
    Component: AddTaxInvoice,
  },
  {
    route: "/ticket/:selectedTicketId",
    Component: TicketList,
  },
  {
    route: "/tickets",
    Component: TicketList,
  },
  // {
  // 	route: '/project/:selectedProjectId',
  // 	Component: ProjectsList,
  // },
  {
    route: "/project/:selectedProjectId",
    Component: ProjectDetail,
  },
  {
    route: "/projects",
    Component: ProjectsList,
  },
  {
    route: "/students",
    Component: StudentsList,
  },
  {
    route: "/customers",
    Component: CustomerList,
  },
  {
    route: "/schedulers",
    Component: SchedulerList,
  },
  {
    route: "/composites",
    Component: CompositeList,
  },
  {
    route: "/settings",
    Component: Settings,
  },
  {
    route: "/profile",
    Component: ProfilePage,
  },
  {
    route: "/suppliers",
    Component: SuppliersList,
  },
  {
    route: "/leads",
    Component: LeadsList,
  },
  {
    route: "/sales-order",
    Component: OrdersList,
  },
  {
    route: "/estimate",
    Component: EstimatesList,
  },
  {
    route: "/inventory",
    Component: InventoryList,
  },
  {
    route: "/purchases",
    Component: PurchasesList,
  },
  {
    route: "/tax-invoice",
    Component: TaxInvoiceList,
  },
  {
    route: "/stocks",
    Component: StocksList,
  },
  {
    route: "/users",
    Component: UserList,
  },
  {
    route: "/items",
    Component: Items,
  },
  {
    route: "/masters",
    Component: Master,
  },
  {
    route: "/invoice",
    Component: InvoiceList,
  },
  {
    route: "/service-trip",
    Component: ServiceTripList,
  },
  {
    route: "/voucher",
    Component: VoucherList,
  },
  {
    route: "/board",
    Component: Board,
  },
  {
    route: "/tickets",
    Component: TicketList,
  },
  {
    route: "/received-entry",
    Component: LoadIn,
  },
  {
    route: "/payments",
    Component: PaymentsList,
  },
  {
    route: "/tasks",
    Component: TasksList,
  },
  {
    route: "/preferences",
    Component: Preferences,
  },
  {
    route: "/customer-payments",
    Component: ReceiptList,
  },
  {
    route: "/customer-statements",
    Component: CustomerStatementList,
  },
  {
    route: "/export-invoice",
    Component: ExportInvoiceList,
  },
  {
    route: "/export-gst-json",
    Component: ExportGstJsonList,
  },
  {
    route: "/faq-extractor",
    Component: FaqExtractor,
  },
  {
    route: "/",
    Component: Dashboard,
  },
  {
    route: "/accounts",
    Component: AccountList,
  },
  {
		route: '/contacts',
		Component: ContactList,
	},
];

export { ACTIONS, MENUS, ROUTES, API_STATUS, SIDE_MENUS };

const CUSTOMER_TYPE = ["Customer", "Supplier", "Lead", "Contact"];
const CATEGORIES = ["Individual", "Business"];
const USER_TYPE = ["Admin", "Staff"];
const GST_TREATMENT = [
  { label: "Consumer", value: "consumer" },
  { label: "Registered Business", value: "registered" },
];
const PLACE_OF_SUPPLY = ["Tamilnadu", "Others"];
const SCHEDULER_TYPE = ["Service"];

const STATUS_DROPDOWN = [
  "Open",
  "Assigned",
  "Accepted",
  "In Progress",
  "Completed",
  "Cancelled",
  "Pending",
];
const ORDER_STATUS_DROPDOWN = [
  "Pending",
  "Ready to Dispatch",
  "Completed",
  "Cancelled",
];

// const STATUS_DROPDOWN_FORMATTED = STATUS_DROPDOWN.map((status) => ({
// 	label: status,
// 	value: status,
// }));

export const STATUS = {
  Pending: "processing",
  InTransit: "processing",
  Adjusted: "processing",
  Active: "processing",
  InStock: "success",
  Completed: "success",
  Dispatched: "success",
  Add: "success",
  "Ready to Dispatch": "warning",
  Halting: "warning",
  Reduce: "error",
  Cancelled: "error",
  UnPaid: "error",
  Draft: "processing",
  Generated: "success",
  "In Progress": "processing",
  "Ready to Dispatch": "warning",
  Sent: "success",
  "Not Sent": "error",
  "Not Started": "processing",
};

export {
  CUSTOMER_TYPE,
  GST_TREATMENT,
  PLACE_OF_SUPPLY,
  SCHEDULER_TYPE,
  USER_TYPE,
  CATEGORIES,
  STATUS_DROPDOWN,
  ORDER_STATUS_DROPDOWN,
};

export const NOTIFICATION_STATUS_TYPES = {
  SUCCESS: "SUCCESS",
  INFO: "INFO",
  ERROR: "ERROR",
  WARNING: "WARNING",
};

export const DEPARTMENT_LIST = [
  "Rufcasting",
  "Scrap",
  "Rejection",
  "Others ",
  "Invoice ",
];
export const PRIORITIES = ["None", "Low", "Medium", "High"];

export const ITEM_TYPES = [
  { label: "Goods", value: "Goods" },
  { label: "Service", value: "Service" },
  { label: "Digital", value: "Digital" },
];

export const SERIAL_TYPE = {
  ADD: "ADD",
  EDIT: "EDIT",
  REMOVE: "REMOVE",
};

export const ITEM_TAX_TYPE = [
  {
    label: "Tax Exclusive",
    value: "Exclusive",
  },
  {
    label: "Tax Inclusive",
    value: "Inclusive",
  },
  // {
  // 	label: 'None',
  // 	value: 'None',
  // },
];

export const VOUCHER_TYPE = [
  {
    label: "Business",
    value: "Business",
  },
  {
    label: "Personal",
    value: "Personal",
  },
];

export const INVOICE_TYPE = [
  {
    label: "Tax Invoices",
    value: "Invoice",
  },
  {
    label: "Retail Invoices",
    value: "Retail",
  },
];

export const TAX_TYPE = [
  {
    label: "IntraState",
    value: "IntraState",
  },
  {
    label: "InterState",
    value: "InterState",
  },
  {
    label: "None",
    value: "None",
  },
];

export const ACCOUNT_TYPES = [
  { value: "Savings", label: "Savings" },
  { value: "Current", label: "Current" },
  { value: "Salary", label: "Salary" },
];

export const INVOICE_STATUS = {
  Generated: "Generated",
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
  Draft: "Draft",
  Cancelled: "Cancelled",
  "In Transit": "In Transit",
  "Ready to Dispatch": "Ready to Dispatch",
  Dispatched: "Dispatched",
  Completed: "Completed",
  Unpaid: "Unpaid",
};

export const LEAD_SOURCE = [
  "-None-",
  "Advertisement",
  "Cold Call",
  "Employee Referral",
  "External Referral",
  "Online Store",
  "Partner",
  "Public Relations",
  "Sales Email Alias",
  "Seminar Partner",
  "Internal Seminar",
  "Trade Show",
  "Web Download",
  "Web Research",
  "Chat",
  "X (Twitter)",
  "Facebook",
];

export const LEAD_STATUS = [
  "-None-",
  "Attempted to Contact",
  "Contact in Future",
  "Contacted",
  "Junk Lead",
  "Lost Lead",
  "Not Contacted",
  "Pre-Qualified",
  "Not Qualified",
];

export const INDUSTRY = [
  "-None-",
  "ASP (Application Service Provider)",
  "Data/Telecom OEM",
  "ERP (Enterprise Resource Planning)",
  "Government/Military",
  "Large Enterprise",
  "Management ISV",
  "MSP (Management Service Provider)",
  "Network Equipment Enterprise",
  "Non-management ISV",
  "Optical Networking",
  "Service Provider",
  "Small/Medium Enterprise",
  "Storage Equipment",
  "Storage Service Provider",
  "Systems Integrator",
  "Wireless Industry",
  "ERP",
  "Management ISV",
];

export const RATING = [
  "-None-",
  "Acquired",
  "Active",
  "Market Failed",
  "Project Cancelled",
  "Shut Down",
];

export const ACCOUNT_INDUSTRY = [
  "-None-",
  "ASP (Application Service Provider)",
  "Data/Telecom OEM",
  "ERP (Enterprise Resource Planning)",
  "Government/Military",
  "Large Enterprise",
  "ManagementISV",
  "MSP (Management Service Provider)",
  "Network Equipment Enterprise",
  "Non-management ISV",
  "Optical Networking",
  "Service Provider",
  "Small/Medium Enterprise",
  "Storage Equipment",
  "Storage Service Provider",
  "Systems Integrator",
  "Wireless Industry",
  "Financial Services",
  "Education",
  "Technology",
  "Real Estate",
  "Consulting",
  "Communications",
  "Manufacturing",
];

export const OWNERSHIP = [
  "-None-",
  "Other",
  "Private",
  "Public",
  "Subsidiary",
  "Partnership",
  "Government",
  "Privately Held",
  "Public Company",
];

export const ACCOUNT_TYPE = [
  "-None-",
  "Analyst",
  "Competitor",
  "Customer",
  "Distributor",
  "Integrator",
  "Investor",
  "Other",
  "Partner",
  "Press",
  "Prospect",
  "Reseller",
  "Supplier",
  "Vendor",
];
