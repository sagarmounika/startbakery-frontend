// TimeSeriesChart.js
import React, {useState, useRef, useEffect, useCallback} from "react"
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
  const containerRef = useRef(null)
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

    // exportEnabled: true,
    animationEnabled: true,
    animationDuration: 2000,
    toolTip: {
      fontColor: "black",
    },
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
    // height: "500px",
    data: canvasJSData,
  }

  const onSelect = val => {
    setType(val)
  }
  const onWheel = useCallback(e => {
    e.preventDefault()
    const chart = chartRef.current
    const container = containerRef.current
    const {x1, x2, y1, y2} = chart?.plotArea
   

    container.scrollTo({bottom: container.scrollHeight, behavior: "smooth"})
    zoomHandler(chart, e)
    //  container.scrollTop += e.deltaY
  }, [])
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
      {/* <div onWheel={e => wheelHandler(e)}> */}
      <div className={style.chartContainer} ref={divRefCallback}>
        <CanvasJSChart
          options={canvasJSOptions}
          onRef={ref => (chartRef.current = ref)}
          id="chart"
          // ref={containerRef}
        />
      </div>

      {/* </div> */}
    </div>
  )
}

export default TimeSeriesChart
