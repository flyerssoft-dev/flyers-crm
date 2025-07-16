import { userData } from '@constants/userData';
const WELCOME_BACK = 'Welcome Back!';
const HELLO = 'Hello!';
const HR_TEAM = 'HR TEAM';

const LOGIN_DATA = {
  flyers: 'Flyers',
  connect: 'Connect',
  Login: 'Login to Flyers Connect',
};

const BUTTON_TYPE = {
  delete: 'Delete',
  saveChanges: 'Save changes',
  apply: 'Apply',
  update: 'Update',
  applyLeaves: 'Apply Leave',
  export: 'Export',
  submit: 'Submit',
  newTicket: 'New ticket',
  approve: 'Approve',
  deny: 'Deny',
  add: 'Add',
  createRole: 'Create Role',
  updatePermission: 'Update Permissions',
  updateRolePriority: 'Update Role Priority',
  newCategory: 'Add Category',
};

export const CURRENCY_OPTION = [
  { label: 'USD($)', value: 'USD' },
  { label: 'INR(₹)', value: 'INR' },
  { label: 'EUR(€)', value: 'EUR' },
  { label: 'AED(د.إ)', value: 'AED' },
];

export { userData, WELCOME_BACK, HELLO, HR_TEAM, LOGIN_DATA, BUTTON_TYPE };
