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
  const {timeFilteredData} = useSelector(state => state.dashboardReducer)

  // on click of any bar in type chart and scrolling to top
  const handleTypeSelect = e => {
    const type = e.dataPoint.label
    dispatch(setSelectedType(type))
    scrollToTop()
  }
  // on click of any bar in state chart and scrolling to top
  const handleStateSelect = e => {
    const type = e.dataPoint.label
    dispatch(setSelectedState(type))
    scrollToTop()
  }

  // on click of any bar in branch chart and scrolling to top
  const handleRegionSelect = e => {
    const type = e.dataPoint.label2
    dispatch(setSelectedRegion(Number(type)))
    scrollToTop()
  }
  // grouping based on type
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
  // grouping based on state
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
  // grouping based on branch
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
    </div>
  )
}

export default ChartWrapper
