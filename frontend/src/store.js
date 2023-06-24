import { createStore, combineReducers, applyMiddleware } from "redux";

//thunk is used when we need to return functions instead of action objects asynchrnously with promise handling
import thunk from "redux-thunk";

//used to view states, actions in chrome's Readux DevTools extension
import { composeWithDevTools } from "redux-devtools-extension";
import {
  productDetailsReducer,
  productReducer,
} from "./Services/Reducers/productReducer";
import { userReducer } from "./Services/Reducers/userReducer";

//using combine reducer to combine all reducers in the website to use as one
const reducer = combineReducers({
  //PRODUCTS
  products: productReducer,
  productDetails: productDetailsReducer,

  //USER
  user: userReducer,
});

let initialState = {};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
