import { legacy_createStore as createStore } from "redux";
import gameReducer from "./reducers";

const store = createStore(gameReducer);

export default store;
