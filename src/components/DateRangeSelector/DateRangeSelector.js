import React, {useState, useEffect, forwardRef} from "react"
import "@wojtekmaj/react-datetimerange-picker/dist/DateTimeRangePicker.css"
import "react-calendar/dist/Calendar.css"
import "react-clock/dist/Clock.css"
import {setStartDate, setEndDate} from "../../Reducers/dashboardSlice"
import {useDispatch, useSelector} from "react-redux"
import "react-clock/dist/Clock.css"
import DateTimeRangePicker from "@wojtekmaj/react-datetimerange-picker"
import style from "./dataRange.module.scss"
import {FaFilter} from "react-icons/fa"

const DateRangeSelector = forwardRef((props, ref) => {

  const {groupedData} = useSelector(state => state.dashboardReducer.groupData)
  const {selectedTimeRange, startDate, endDate} = useSelector(
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
    // setting max date and min date and making sure they are changed only when timerange changes, because on filtering groupdata might change extremes when it should be initial extremes
    if (selectedTimeRange && groupedData.length > 0) {
      const firstDate = new Date(groupedData[0].x)
      const lastDate = new Date(groupedData[groupedData.length - 1].x)
      setMinDate(firstDate)
      setMaxDate(lastDate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTimeRange])

  useEffect(() => {
    // initially when no range is selected initiating extremes with max and min
    if (startDate && endDate) {
      setValue([startDate, endDate])
    } else {
      setValue([minDate, maxDate])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDate, maxDate])
  
  const applyFilter = () => {
    dispatch(setStartDate(value[0]))
    dispatch(setEndDate(value[1]))
  }
  return (
    <div className={style.rangeWrapper} ref={ref}>
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
})

export default DateRangeSelector
