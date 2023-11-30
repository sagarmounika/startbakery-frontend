import React from "react"
import {Outlet} from "react-router-dom"
import Navbar from "../Navbar/Navbar"

export default function Layout() {
  return (
    <>
      <Navbar />
      <div width="100%" height="100%" mt="5">
        <Outlet />
      </div>
    </>
  )
}
