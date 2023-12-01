import {
  configureStore,
  createSerializableStateInvariantMiddleware,
  isPlain,
} from "@reduxjs/toolkit"

import dashboardReducer from "./Reducers/dashboardSlice"
import sidebarReducer from "./Reducers/sidebarSlice"
const isSerializable = value => {
  return isPlain(value) || value instanceof Date
}

const serializableMiddleware = createSerializableStateInvariantMiddleware({
  isSerializable,
})
export const store = configureStore({
  reducer: {
    dashboardReducer: dashboardReducer,
    sidebarReducer: sidebarReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
