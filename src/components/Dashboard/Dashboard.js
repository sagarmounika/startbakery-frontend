import React, {useState, useEffect, useLayoutEffect} from "react"
import TimeSelector from "../TimeSelector/TimeSelector"
import DateRangeSelector from "../DateRangeSelector/DateRangeSelector"
import ChartWrapper from "../ChartWrapper/ChartWrapper"
import TimeSeriesChart from "../TimeSeries/TimeSeriesChart"
import {getOrdersData, clearAll} from "../../Reducers/dashboardSlice"
import moment from "moment"
import {setGroupData, setTimeFilteredData} from "../../Reducers/dashboardSlice"
import {groupOrdersByTimeGranularity} from "../../features/dashboard/utils"
import {useDispatch, useSelector} from "react-redux"
import {RxReset} from "react-icons/rx"
import style from "./dashboard.module.scss"

import RGL, {WidthProvider} from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"

const ReactGridLayout = WidthProvider(RGL)
const Dashboard = () => {
  const dispatch = useDispatch()
  const {
    ordersData,
    selectedType,
    selectedState,
    selectedRegion,
    selectedTimeRange,
    timeFilteredData,
    selectedLabel,
    startDate,
    endDate,
    loading,
  } = useSelector(state => state.dashboardReducer)
  const [timeSeriesHeight, setTimeSeriesHeight] = useState(400)

  const {groupedData} = useSelector(state => state.dashboardReducer.groupData)
  useEffect(() => {
    dispatch(getOrdersData({onSuccess: () => {}, onFailure: () => {}}))
  }, [])
  useEffect(() => {
    let filteredByTime = ordersData.filter(order =>
      moment(order.lastUpdateTime).isAfter(
        moment().subtract(1, selectedTimeRange).startOf(selectedTimeRange)
      )
    )
    console.log(ordersData, selectedTimeRange)
    // // Filter by date if startDate and endDate are defined
    if (startDate && endDate) {
      filteredByTime = filteredByTime.filter(order =>
        moment(order.lastUpdateTime).isBetween(startDate, endDate, null, "[]")
      )
    }

    dispatch(setTimeFilteredData(filteredByTime))
  }, [selectedTimeRange, ordersData, startDate, endDate])

  useEffect(() => {
    console.log(timeFilteredData, "are u timeFilteredData")
    if (timeFilteredData.length > 0) {
      const {groupedData, groupedTotalValueData} = groupOrdersByTimeGranularity(
        timeFilteredData,
        selectedTimeRange,
        selectedType,
        selectedState,
        selectedRegion
      )
      dispatch(setGroupData({groupedData, groupedTotalValueData}))
      console.log(groupedData, "groupedData")
    } else {
      dispatch(setGroupData({groupedData: [], groupedTotalValueData: []}))
    }
  }, [timeFilteredData, selectedType, selectedState, selectedRegion])

  const clearHandler = () => {
    dispatch(clearAll())
  }
  useLayoutEffect(() => {
    // Function to calculate the height of TimeSeriesChart
    const calculateTimeSeriesHeight = () => {
      const timeSeriesElement = document.getElementById("timeseries-chart")
      console.log(timeSeriesElement, "timeSeriesElement")
      if (timeSeriesElement) {
        const rect = timeSeriesElement.getBoundingClientRect()
        const height = rect.height
        console.log(height, "height")
        setTimeSeriesHeight(height)
      }
    }

    // Call the function on mount and after each render
    calculateTimeSeriesHeight()
    window.addEventListener("resize", calculateTimeSeriesHeight)

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", calculateTimeSeriesHeight)
    }
  }, [groupedData])
  return (
    <div className={style.dashboardContainer}>
      {loading ? (
        "loading"
      ) : (
        <>
          <div className={style.dashboardHeader}>
            {selectedLabel && (
              <div className={style.headeLeft}>
                <div className={style.headerIcon} onClick={clearHandler}>
                  <RxReset />
                </div>
                <div className={style.headerContent}>
                  <div className={style.headerTitle}>
                    {selectedRegion || selectedState || selectedType}
                  </div>
                  <div className={style.headerSubTitle}>
                    Selected {selectedLabel}
                  </div>
                </div>
              </div>
            )}
            <TimeSelector />
          </div>
          {groupedData.length ? (
            <>
              <DateRangeSelector />
              {/* <ReactGridLayout
                className={style.layout}
                cols={3}
                rowHeight={timeSeriesHeight}
              >
                <div key="timeseries" data-grid={{x: 0, y: 0, w: 3, h: 1}}>
                  <TimeSeriesChart />
                </div>

                <ChartWrapper
                  key="chartwrapper"
                  data-grid={{x: 0, y: 1, w: 3, h: 1}}
                />
              </ReactGridLayout> */}
              <TimeSeriesChart />
              <ChartWrapper />
            </>
          ) : (
            "No data available"
          )}
        </>
      )}

      {/* <div className={style.chartContainer}>

      <TimeSeriesChart />
      <ChartWrapper />
      </div> */}
    </div>
  )
}

export default Dashboard
