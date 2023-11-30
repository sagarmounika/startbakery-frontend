// DateRangeSelector.js

import React, {useState, useEffect} from "react"
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"
import {setStartDate, setEndDate} from "../../Reducers/dashboardSlice"
import {useDispatch, useSelector} from "react-redux"
import "react-clock/dist/Clock.css"
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker"
import style from "./dataRange.module.scss"
import {FaFilter} from "react-icons/fa"
const DateRangeSelector = () => {
  const {groupedData} = useSelector(state => state.dashboardReducer.groupData)
  const {selectedTimeRange, startDate, endDate, timeFilteredData} = useSelector(
    state => state.dashboardReducer
  )
  const dispatch = useDispatch()
  const [value, setValue] = useState([])
  const [minDate, setMinDate] = useState(new Date())
  const [maxDate, setMaxDate] = useState(new Date())

  const handleApply = val => {
    setValue(val)
  }
  useEffect(() => {
    if (selectedTimeRange && groupedData.length > 0) {
      const firstDate = new Date(groupedData[0].x)
      const lastDate = new Date(groupedData[groupedData.length - 1].x)
      setMinDate(firstDate)
      setMaxDate(lastDate)
    }
  }, [selectedTimeRange])
  useEffect(() => {
    console.log(minDate, maxDate, startDate)
    if (startDate && endDate) {
      setValue([startDate, endDate])
    } else {
      setValue([minDate, maxDate])
    }
  }, [minDate, maxDate])
  console.log(maxDate, minDate, "maxmin", value)
  const applyFilter = () => {
    dispatch(setStartDate(value[0]))
    dispatch(setEndDate(value[1]))
  }
  return (
    <div className={style.rangeWrapper}>
      <DateTimeRangePicker
        onChange={handleApply}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
      />
      <button onClick={applyFilter} className={style.filterBtn}>
        <div>Apply Filter</div>
        <FaFilter />
      </button>
    </div>
  )
}

export default DateRangeSelector
