import React, {useRef, useEffect} from "react"
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

  // getting order data on mount
  useEffect(() => {
    dispatch(getOrdersData({onSuccess: () => {}, onFailure: () => {}}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //doing common filters on orderdata for both timseries and charts based on selectedtimerange, daterange
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeRange, ordersData, startDate, endDate])

  // grouping filtered data for timeseries chart for each day or hour.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeFilteredData, selectedType, selectedState, selectedRegion])

  // to clear type,range,branch filter
  const clearHandler = () => {
    dispatch(clearAll())
  }
  // to scroll when user clicks on any bar chart value
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
              <TimeSeriesChart />
              <ChartWrapper scrollToTop={scrollToTop} />
            </>
          ) : (
            "No data available"
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
