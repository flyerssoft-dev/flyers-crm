import { applyMiddleware, createStore } from "redux";
import allReducers from "./reducers/index";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { persistStore } from "redux-persist";
import rootSaga from "./sagas/index"

const sagaMiddleware = createSagaMiddleware();
var store;

// if(MODE === "production")
//     store = createStore(allReducers, applyMiddleware(sagaMiddleware));
// else
store = createStore(
  allReducers,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga)

const persistor = persistStore(store);

export { store, persistor };
