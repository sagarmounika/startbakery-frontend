import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"
import axios from "axios"

const ordersEndpoint = "https://starbakery-api.onrender.com/api/orders"

export const getOrdersData = createAsyncThunk(
  "dashboard/orders",
  async args => {
    const {onSuccess, onFailure} = args
    try {
      const response = await axios.get(ordersEndpoint, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
     
      onSuccess()
      let updated = response.data.map(order => ({
        ...order,
        lastUpdateTime: new Date(order.lastUpdateTime.replace(" ", "T")),
      }))
      return updated
    } catch (error) {
      onFailure()
      throw error
    }
  }
)

const initialState = {
  selectedType: null,
  selectedState: null,
  selectedRegion: null,
  startDate: null,
  endDate: null,
  selectedTimeRange: "month",
  selectedLabel: "",
  ordersData: [],
  groupData: {
    groupedData: [],
    groupedTotalValueData: [],
  },
  timeFilteredData: [],
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setSelectedType: (state, action) => {
      state.selectedType = action.payload
      state.selectedState = null
      state.selectedRegion = null
      state.selectedLabel = "Type"
    },
    setSelectedState: (state, action) => {
      state.selectedType = null
      state.selectedState = action.payload
      state.selectedRegion = null
      state.selectedLabel = "State"
    },
    setSelectedRegion: (state, action) => {
      state.selectedType = null
      state.selectedState = null
      state.selectedRegion = action.payload
      state.selectedLabel = "Branch"
    },
    clearAll: (state, action) => {
      state.selectedType = null
      state.selectedState = null
      state.selectedRegion = null
      state.selectedLabel = ""
    },
    setSelectedTimeRange: (state, action) => {
      state.selectedTimeRange = action.payload
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload
    },
    setGroupData: (state, action) => {
      state.groupData = action.payload
    },
    setTimeFilteredData: (state, action) => {
      state.timeFilteredData = action.payload
    },
    clearDates: (state, action) => {
      state.startDate = null
      state.endDate = null
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOrdersData.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(getOrdersData.fulfilled, (state, action) => {
       
        state.loading = false
        state.ordersData = action.payload
      })
      .addCase(getOrdersData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const {
  setSelectedType,
  setSelectedState,
  setSelectedRegion,
  setStartDate,
  setEndDate,
  setSelectedTimeRange,
  setGroupData,
  setTimeFilteredData,
  clearAll,
  clearDates,
} = dashboardSlice.actions

export default dashboardSlice.reducer
