// TimeSelector.js
import React from "react"
import {useDispatch, useSelector} from "react-redux"
import Select, {components} from "react-select"
import {setSelectedTimeRange, clearDates} from "../../Reducers/dashboardSlice"
import {FaRegCalendar} from "react-icons/fa6"
import {customStyles} from "../../features/dashboard/selectUtils"
import style from "./selector.module.scss"
const Control = ({children, ...props}) => {
  const style = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: "2%",
  }

  return (
    <components.Control {...props}>
      <span style={style}>
        <FaRegCalendar />
      </span>
      {children}
    </components.Control>
  )
}

const TimeSelector = () => {
  const dispatch = useDispatch()
  const {selectedTimeRange} = useSelector(state => state.dashboardReducer)

  const handleTimeRangeChange = selectedOption => {
    console.log(selectedOption)
    dispatch(setSelectedTimeRange(selectedOption.value))
    dispatch(clearDates())
  }

  const options = [
    {value: "hour", label: "Last Hour"},
    {value: "day", label: "Last Day"},
    {value: "week", label: "Last Week"},
    {value: "month", label: "Last Month"},
  ]

  return (
    <div className={style.selectorContainer}>
      {/* <label>Select Time Range:</label> */}
      <div className={style.selectorWrap}>
        <Select
          options={options}
          onChange={handleTimeRangeChange}
          defaultValue={options[3]}
          components={{Control}}
          styles={customStyles}
        />
      </div>
    </div>
  )
}

export default TimeSelector
