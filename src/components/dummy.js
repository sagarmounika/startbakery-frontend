import React, {Component} from "react"
import {render} from "react-dom"
import CanvasJSReact from "@canvasjs/react-charts"
var CanvasJSChart = CanvasJSReact.CanvasJSChart

var chart
var dataPointCounter = 0
export default class Dummy extends Component {
  constructor(props) {
    super(props)
    this.wheelHandler = this.wheelHandler.bind(this)
  }

  wheelHandler = e => {
    console.log(chart, "chart")
    e.preventDefault()
    console.log(chart, "chart")
    if (
      e.clientX < chart.plotArea.x1 ||
      e.clientX > chart.plotArea.x2 ||
      e.clientY < chart.plotArea.y1 ||
      e.clientY > chart.plotArea.y2
    )
      return

    var axisX = chart.axisX[0]
    var viewportMin = axisX.get("viewportMinimum"),
      viewportMax = axisX.get("viewportMaximum"),
      interval = axisX.get("minimum")

    var newViewportMin, newViewportMax

    if (e.deltaY < 0) {
      newViewportMin = viewportMin + interval
      newViewportMax = viewportMax - interval
    } else if (e.deltaY > 0) {
      newViewportMin = viewportMin - interval
      newViewportMax = viewportMax + interval
    }

    if (newViewportMin < chart.axisX[0].get("minimum"))
      newViewportMin = chart.axisX[0].get("minimum")

    if (newViewportMax > chart.axisX[0].get("maximum"))
      newViewportMax = chart.axisX[0].get("maximum")

    if (newViewportMax - newViewportMin > 2 * interval) {
      dataPointCounter = 0
      for (var i = 0; i < chart.options.data[0].dataPoints.length; i++) {
        if (
          chart.options.data[0].dataPoints[i].x > newViewportMin &&
          chart.options.data[0].dataPoints[i].x < newViewportMax
        ) {
          dataPointCounter++
        }
      }

      if (dataPointCounter > 2) {
        chart.axisX[0].set("viewportMinimum", newViewportMin, false)
        chart.axisX[0].set("viewportMaximum", newViewportMax)
      }
    }
  }

  render() {
    const options = {
        theme: "light2", // "light1", "dark1", "dark2"
        animationEnabled: true, //Change to false
        animationDuration: 1200, //Change it to 2000
        zoomEnabled: true,
        title: {
          text: "Zooming Chart with Mouse Scroll in React",
        },
        rangeChanged: function (e) {
          if (e.trigger === "reset") {
            e.chart.options.axisX[0].viewportMinimum = null
            e.chart.options.axisX[0].viewportMaximum = null
            e.chart.render()
          }
        },
        data: [
          {
            //Change type to "line", "bar", "area", "pie", etc.
            type: "scatter",
            dataPoints: [
              {x: 10, y: 10},
              {x: 20, y: 15},
              {x: 30, y: 25},
              {x: 40, y: 30},
              {x: 50, y: 28},
              {x: 60, y: 15},
              {x: 70, y: 25},
              {x: 80, y: 30},
              {x: 90, y: 28},
            ],
          },
        ],
      },
      //Styling Chart Container
      containerProps = {
        width: "100%",
        height: "300px",
        border: "1px solid black",
      }

    return (
      <div>
        <div onWheel={this.wheelHandler}>
          <CanvasJSChart
            options={options}
            onRef={ref => (chart = ref)} //Reference to the chart-instance
            containerProps={containerProps}
          />
        </div>
      </div>
    )
  }
}
