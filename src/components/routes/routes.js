import React, {Suspense} from "react"
import ROUTES from "./RenderRoutes.js"
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import SuspenseSpinner from "../SuspenseFallback/SuspenseFallback.js"

const Routes = () => {
  const router = createBrowserRouter(ROUTES)
  return (
    <Suspense fallback={<SuspenseSpinner />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
export default Routes
