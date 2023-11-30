import React from "react"
import {useDispatch, useSelector} from "react-redux"
import {
  setSelectedType,
  setSelectedState,
  setSelectedRegion,
} from "../../Reducers/dashboardSlice"
import CanvasJSReact from "@canvasjs/react-charts"
import {groupOrders} from "../../features/dashboard/chartUtils"
import style from "./chartWrapper.module.scss"
import RGL, {WidthProvider} from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
const ReactGridLayout = WidthProvider(RGL)
const CanvasJSChart = CanvasJSReact.CanvasJSChart
const CanvasJS = CanvasJSReact.CanvasJS
CanvasJS.addColorSet("customColorSet1", [
  "#ffe0e6ff",
  "#cdebffff",
  "#fff3d6ff",
  "#d3f5f5ff",
  "#e6d9ffff",
  "#ffe9d3ff",
])
const ChartWrapper = ({scrollToTop}) => {
  const dispatch = useDispatch()
  const {ordersData, timeFilteredData} = useSelector(
    state => state.dashboardReducer
  )

  const handleTypeSelect = e => {
    const type = e.dataPoint.label
    dispatch(setSelectedType(type))
    scrollToTop()
  }

  const handleStateSelect = e => {
    const type = e.dataPoint.label
    dispatch(setSelectedState(type))
    scrollToTop()
  }

  const handleRegionSelect = e => {
    const type = e.dataPoint.label2

    dispatch(setSelectedRegion(Number(type)))
    scrollToTop()
  }

  const typeChartData = groupOrders(
    timeFilteredData,
    "itemType",
    handleTypeSelect
  )
  const typeChartOptions = {
    animationEnabled: true,
    colorSet: "customColorSet1",
    title: {
      text: "Orders by Type",
      fontSize: 20,
      padding: 5,
      fontWeight: "lighter",
      fontFamily: "Roboto",
    },
    toolTip: {
      fontColor: "black",
    },
    axisX: {
      title: "Type",
      labelFontColor: "#9a9ea2",
      titleFontSize: 15,
    },
    axisY: {
      title: "Number of Orders",
      labelFontColor: "#9a9ea2",
      titleFontSize: 15,
      gridColor: "#ebebeb",
    },

    data: [
      {
        type: "bar",
        cursor: "pointer",
        borderWidth: 2,
        fillOpacity: 0.8,
        dataPoints: typeChartData,
      },
    ],
  }

  const stateChartData = groupOrders(
    timeFilteredData,
    "orderState",
    handleStateSelect
  )
  const stateChartOptions = {
    animationEnabled: true,
    colorSet: "customColorSet1",
    title: {
      text: "Orders by State",
      fontSize: 20,
      padding: 5,
      fontWeight: "lighter",
      fontFamily: "Roboto",
    },
    toolTip: {
      fontColor: "black",
    },
    axisX: {
      title: "State",
      labelFontColor: "#9a9ea2",
      titleFontSize: 15,
    },
    axisY: {
      title: "Number of Orders",
      titleFontSize: 15,
      labelFontColor: "#9a9ea2",
      gridColor: "#ebebeb",
    },
    data: [
      {
        type: "bar",
        cursor: "pointer",
        borderThickness: 2,
        fillOpacity: 0.8,
        dataPoints: stateChartData,
      },
    ],
  }

  const topBranchesChartData = groupOrders(
    timeFilteredData,
    "branch",
    handleRegionSelect
  )
  const topBranchesChartOptions = {
    animationEnabled: true,
    colorSet: "customColorSet1",
    toolTip: {
      fontColor: "black",
    },
    title: {
      text: "Top 5 Branches",
      fontSize: 20,
      padding: 5,
      fontWeight: "lighter",
      fontFamily: "Roboto",
    },
    axisX: {
      title: "Branch",
      labelFontColor: "#9a9ea2",
      titleFontSize: 15,
    },
    axisY: {
      title: "Number of Orders",
      titleFontSize: 15,
      labelFontColor: "#9a9ea2",
      gridColor: "#ebebeb",
      fillOpacity: 0.8,
    },
    data: [
      {
        cursor: "pointer",
        type: "column",
        borderThickness: 2,
        dataPoints: topBranchesChartData,
      },
    ],
  }
  const charts = [
    {options: typeChartOptions},
    {options: stateChartOptions},
    {options: topBranchesChartOptions},
  ]
  return (
    <div className={style.chartWrapper}>
      {charts.map((chart, index) => (
        <CanvasJSChart options={chart.options} key={index} />
      ))}
      {/* <ReactGridLayout
        className="nested-layout"
        cols={3}
        rowHeight={150}
        width={800}
      >
        {charts.map((chart, index) => (
          <div
            key={`chartwrapper-${index}`}
            data-grid={{x: index, y: 0, w: 1, h: 1}}
          >
            <CanvasJSChart options={chart.options} />
          </div>
        ))}
      </ReactGridLayout> */}
    </div>
  )
}

export default ChartWrapper
