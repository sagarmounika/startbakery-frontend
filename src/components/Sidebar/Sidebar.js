import React from "react"
import style from "./sidebar.module.scss"
import {useDispatch, useSelector} from "react-redux"
import {setSidebarOption} from "../../Reducers/sidebarSlice"
import {MdDashboardCustomize, MdOutlineTableView} from "react-icons/md"
const Sidebar = () => {
  const dispatch = useDispatch()
  const {sidebarOption} = useSelector(state => state.sidebarReducer)
  const options = [
    {
      value: "dashboard",
      title: "Dashboard",
      component: MdDashboardCustomize,
    },
    {
      value: "tables",
      title: "Tables",
      component: MdOutlineTableView,
    },
  ]
  const selectOptionHandler = val => {
    dispatch(setSidebarOption(val))
  }
  return (
    <div className={style.sidebar}>
      {" "}
      <div className={style.logo}>
        <img src="./logo.png" alt="Logo" />
        <div>Star Bakery</div>
      </div>
      <div className={style.optionsWrapper}>
        {options.map((opt, index) => (
          <div
            className={`${style.option} ${
              opt.value === sidebarOption ? style.selected : ""
            }`}
            key={index}
            onClick={() => selectOptionHandler(opt.value)}
          >
            <opt.component />
            <div>{opt.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
