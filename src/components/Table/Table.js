import React from "react"
import style from "./table.module.scss"
import TableComponent from "./TableComponent"
import {useDispatch, useSelector} from "react-redux"
const Table = () => {
  const {ordersData} = useSelector(state => state.dashboardReducer)
  const data = [
    {name: "John", age: 25, country: "USA"},
    {name: "Alice", age: 30, country: "Canada"},
    {name: "Bob", age: 22, country: "UK"},
    // Add more data as needed
  ]

  return (
    <div>
      <h1>React Table with Pagination and Filtering</h1>
      {/* <TableComponent data={ordersData} /> */}
    </div>
  )
}

export default Table
