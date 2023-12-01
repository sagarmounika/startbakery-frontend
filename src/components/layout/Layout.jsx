import React from "react"
import {useSelector} from "react-redux"
import style from "./layout.module.scss"
import Dashboard from "../Dashboard/Dashboard"
import Sidebar from "../Sidebar/Sidebar"
import Table from "../Table/Table"
export default function Layout() {
  const {sidebarOption} = useSelector(state => state.sidebarReducer)
  return (
    <>
      {/* <Navbar /> */}
      <div className={style.layoutContainer}>
        <Sidebar />
        {sidebarOption === "dashboard" ? <Dashboard /> : <Table />}
      </div>
    </>
  )
}
