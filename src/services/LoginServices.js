import { logoutAction } from '../redux/reducers/login/loginActions';
import { store } from '../redux/store';

const applicationLogout = async () => await store.dispatch(logoutAction());

export { applicationLogout };
