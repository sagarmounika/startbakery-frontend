import React, {useRef, useEffect, useLayoutEffect, forwardRef} from "react"
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
  const scrollRef = useRef(null)
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
   
    if (startDate && endDate) {
      filteredByTime = filteredByTime.filter(order =>
        moment(order.lastUpdateTime).isBetween(startDate, endDate, null, "[]")
      )
    }

    dispatch(setTimeFilteredData(filteredByTime))
  }, [selectedTimeRange, ordersData, startDate, endDate])

  useEffect(() => {
   
    if (timeFilteredData.length > 0) {
      const {groupedData, groupedTotalValueData} = groupOrdersByTimeGranularity(
        timeFilteredData,
        selectedTimeRange,
        selectedType,
        selectedState,
        selectedRegion
      )
      dispatch(setGroupData({groupedData, groupedTotalValueData}))
     
    } else {
      dispatch(setGroupData({groupedData: [], groupedTotalValueData: []}))
    }
  }, [timeFilteredData, selectedType, selectedState, selectedRegion])

  const clearHandler = () => {
    dispatch(clearAll())
  }
  const scrollToTop = () => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }
  return (
    <div className={style.dashboardContainer}>
      {loading ? (
        <div className={style.laodingContainer}>
          <img src="./loading.gif" alt="Logo" />
        </div>
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
              <DateRangeSelector ref={scrollRef} />
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
              <ChartWrapper scrollToTop={scrollToTop} />
            </>
          ) : (
            "No data available"
          )}
        </>
      )}
      {/* <Dummy /> */}
      {/* <div className={style.chartContainer}>

      <TimeSeriesChart />
      <ChartWrapper />
      </div> */}
    </div>
  )
}

export default Dashboard
