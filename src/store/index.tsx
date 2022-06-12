import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { homeReducer, userReducer } from "./reducers";

const rootReducer = combineReducers({ homeReducer, userReducer });
const store = configureStore({ reducer: rootReducer });

export default store;
