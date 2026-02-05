// import { configureStore } from "@reduxjs/toolkit";
// export const store = configureStore({ reducer: {} });


import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import customerReducer from "./slices/customerSlice";
import inquiryReducer from "./slices/inquirySlice";
import cityReducer from "./slices/citySlice";
import hotelReducer from "./slices/hotelSlice";
import excursionReducer from "./slices/excursionSlice";
import quotationReducer from "./slices/quotationSlice";
import standardDescriptionReducer from "./slices/standardDescriptionSlice";
import authReducer from "./slices/authSlice";

// ...
export const store = configureStore({
  reducer: {
    users: userReducer,
    customers: customerReducer,
    inquiries: inquiryReducer,
    cities: cityReducer,
    hotels: hotelReducer,
    excursions: excursionReducer,
    quotations: quotationReducer,
    standardDescriptions: standardDescriptionReducer,
    auth: authReducer,
  },
});
