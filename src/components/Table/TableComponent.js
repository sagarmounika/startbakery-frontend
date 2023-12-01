// TableComponent.js
import React, {useMemo} from "react"
import {useTable, usePagination, useFilters} from "react-table"
import Moment from "moment"
const TableComponent = ({data}) => {
  const columns = React.useMemo(
    () =>
      data.length > 0
        ? Object.keys(data[0]).map(key => ({
            Header: key,
            accessor: key,
          }))
        : [],
    [data]
  )
  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} =
    useTable({columns, data})
  return (
    <div>
      <h2>Dynamic Table</h2>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default TableComponent
