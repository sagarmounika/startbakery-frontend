import {Route, createRoutesFromElements} from "react-router-dom"
import Dashboard from "../Dashboard/Dashboard"
import Layout from "../layout/Layout"
import TimeSeriesChart from "../TimeSeries/TimeSeriesChart"
const ROUTES = createRoutesFromElements(
  <Route path="/">
    <Route element={<Layout />}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/test" element={<TimeSeriesChart />} />
    </Route>
  </Route>
)
export default ROUTES
