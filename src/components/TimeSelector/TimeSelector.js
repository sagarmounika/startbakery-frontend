import React from "react"
import {useDispatch} from "react-redux"
import Select, {components} from "react-select"
import {setSelectedTimeRange, clearDates} from "../../Reducers/dashboardSlice"
import {FaRegCalendar} from "react-icons/fa6"
import {customStyles} from "../../features/dashboard/selectUtils"
import style from "./selector.module.scss"

// calendar icon for select
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

  // when time range changes
  const handleTimeRangeChange = selectedOption => {    
    dispatch(setSelectedTimeRange(selectedOption.value))
    // clearing startdate and enddate to be calculated again. which is used in daterangefilter
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
