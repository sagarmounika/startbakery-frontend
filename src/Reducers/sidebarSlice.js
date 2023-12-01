import {createSlice} from "@reduxjs/toolkit"
const initialState = {
  sidebarOption: "dashboard",
}

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarOption: (state, action) => {
      state.sidebarOption = action.payload

    },
  },
})

export const {setSidebarOption} = sidebarSlice.actions

export default sidebarSlice.reducer
