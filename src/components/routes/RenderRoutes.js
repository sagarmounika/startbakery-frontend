import {Route, createRoutesFromElements} from "react-router-dom"
import Dashboard from "../Dashboard/Dashboard"
import Layout from "../layout/Layout"

const ROUTES = createRoutesFromElements(
  <Route path="/">
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
    </Route>
  </Route>
)
export default ROUTES
