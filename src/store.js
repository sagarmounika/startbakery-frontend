import {configureStore} from "@reduxjs/toolkit"
import dashboardReducer from "./Reducers/dashboardSlice"

export const store = configureStore({
  reducer: {
    dashboardReducer: dashboardReducer,
  },
})
