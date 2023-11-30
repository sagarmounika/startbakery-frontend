// TimeSeriesChart.js
import React, {useState, useRef} from "react"
import CanvasJSReact from "@canvasjs/react-charts"
import {useDispatch, useSelector} from "react-redux"
import {customStyles} from "../../features/dashboard/selectUtils"
import {zoomHandler} from "../../features/dashboard/chartUtils"
import style from "./timeSeries.module.scss"
import Select from "react-select"
const CanvasJSChart = CanvasJSReact.CanvasJSChart
const options = [
  {value: "all", label: "Show All"},
  {value: "no", label: "No of Orders"},
  {value: "total", label: "Total Value Of Orders"},
]
const TimeSeriesChart = () => {
  const chartRef = useRef(null)
  const dataPointCounterRef = useRef(0)

  const {groupedData, groupedTotalValueData} = useSelector(
    state => state.dashboardReducer.groupData
  )
  const [type, setType] = useState(options[0])
  const canvasJSData =
    type.value === "all"
      ? [
          {
            type: "spline",
            dataPoints: groupedData,
            showInLegend: true,
            name: "Number of Orders",
          },
          {
            type: "splineArea",
            fillOpacity: 0.3,
            showInLegend: true,
            lineColor: "#51CDA0",
            color: "#51CDA0",
            axisYType: "secondary",
            dataPoints: groupedTotalValueData,
            name: "Total Value  (Rupees)",
          },
        ]
      : type.value === "no"
      ? [
          {
            type: "spline",
            dataPoints: groupedData,
            showInLegend: true,
            name: "Number of Orders",
          },
        ]
      : [
          {
            type: "splineArea",
            fillOpacity: 0.3,
            showInLegend: true,
            lineColor: "#51CDA0",
            color: "#51CDA0",
            axisYType: "secondary",
            dataPoints: groupedTotalValueData,
            name: "Total Value  (Rupees)",
          },
        ]

  const canvasJSOptions = {
    zoomEnabled: true,
    zoomType: "xy",
    // exportEnabled: true,
    animationEnabled: true,
    // title: {
    //   text: "Order Data",
    //   fontSize: 25,
    //   padding: 5,
    //   fontWeight: "lighter",
    //   fontFamily: "Roboto",
    // },
    axisX: {
      title: "Time",
      labelFontColor: "#9a9ea2",
      gridColor: "#ebebeb",
    },
    axisY: {
      title: "Number of Orders",
      titleFontColor: "#4F81BC",
      lineColor: "#4F81BC",
      tickColor: "#4F81BC",
      labelFontColor: "#4F81BC",
      labelFontWeight: "#lighter",
      gridColor: "#ebebeb",
    },
    axisY2: {
      title: "Total Value (Rupees)",
      titleFontColor: "#389674",
      lineColor: "#389674",
      labelFontColor: "#389674",
      tickColor: "#389674",
      gridColor: "#ebebeb",
      suffix: " Rs",
    },
    // height: "500px",
    data: canvasJSData,
  }

  const wheelHandler = e => {
    zoomHandler(e, chartRef, dataPointCounterRef)
  }

  const onSelect = val => {
    setType(val)
  }
  return (
    <div
      onWheel={wheelHandler}
      className={style.timeChartContainer}
      id="timeseries-chart"
    >
      <div className={style.header}>
        <div className={style.title}>Order Data</div>
        <div className={style.selectWrapper}>
          <Select
            options={options}
            onChange={onSelect}
            styles={customStyles}
            defaultValue={options[0]}
            value={type}
          />
        </div>
      </div>
      <CanvasJSChart
        options={canvasJSOptions}
        onRef={ref => (chartRef.current = ref)}
      />
    </div>
  )
}

export default TimeSeriesChart
