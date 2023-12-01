import React, {useState, useRef, useCallback} from "react"
import CanvasJSReact from "@canvasjs/react-charts"
import {useSelector} from "react-redux"
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
  const containerRef = useRef(null)
  const {groupedData, groupedTotalValueData} = useSelector(
    state => state.dashboardReducer.groupData
  )
  const [type, setType] = useState(options[0])

  // data based on type
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
    // exportEnabled: true,
    animationEnabled: true,
    animationDuration: 2000,
    toolTip: {
      fontColor: "black",
    },
    // when user zooms using mouse wheel and want to go back to original
    rangeChanged: function (e) {
      if (e.trigger === "reset") {
        e.chart.options.axisX.viewportMinimum = null
        e.chart.options.axisX.viewportMaximum = null
        e.chart.axisX[0].viewportMinimum = null
        e.chart.axisX[0].viewportMaximum = null
        e.chart.render()
      }
    },
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
    data: canvasJSData,
  }
  // type select
  const onSelect = val => {
    setType(val)
  }

  // when user zooms onmouse wheel
  const onWheel = useCallback(e => {
    e.preventDefault()
    const chart = chartRef.current
    const container = containerRef.current
    container.scrollTo({bottom: container.scrollHeight, behavior: "smooth"})
    zoomHandler(chart, e)
  }, [])

  // to get parent div using ref and attaching onwheel with passive false.
  const divRefCallback = useCallback(
    node => {
      if (node == null) {
        return
      }
      containerRef.current = node
      node.addEventListener("wheel", onWheel, {passive: false})
    },
    [onWheel]
  )
  return (
    <div
      className={style.timeChartContainer}
      id="timeseries-chart"
      ref={divRefCallback}
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
      <div className={style.chartContainer} ref={divRefCallback}>
        <CanvasJSChart
          options={canvasJSOptions}
          onRef={ref => (chartRef.current = ref)}
          id="chart"
        />
      </div>
    </div>
  )
}

export default TimeSeriesChart
