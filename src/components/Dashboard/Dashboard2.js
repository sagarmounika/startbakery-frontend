import React, {useState, useEffect, useRef} from "react"
import axios from "axios"
import CanvasJSReact from "@canvasjs/react-charts"
import CanvasJSReact2 from "@canvasjs/react-stockcharts"
import moment from "moment"
import TimeSelector from "../TimeSelector/TimeSelector"
const CanvasJSChart = CanvasJSReact.CanvasJSChart
const CanvasJSStockChart = CanvasJSReact2.CanvasJSStockChart
const Dashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("hour")
  const [orderData, setOrderData] = useState([])
  const [selectedType, setSelectedType] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState(null)

  const chartRef = useRef(null)
  const dataPointCounterRef = useRef(0)

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/orders")
      setOrderData(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    // fetchData()
  }, [selectedTimeRange])

  const formattedOrderData = orderData.map(order => ({
    ...order,
    lastUpdateTime: new Date(order.lastUpdateTime.replace(" ", "T")),
  }))

  const calculateTotalValue = order => {
    // Replace this with your logic to calculate the total value of orders
    return order.qty * getPriceByItemType(order.itemType)
  }

  const getPriceByItemType = itemType => {
    switch (itemType) {
      case "Cake":
        return 500
      case "Cookies":
        return 50
      case "Muffins":
        return 100
      default:
        return 0
    }
  }

  const groupOrdersByTimeGranularity = granularity => {
    const filteredData = formattedOrderData
      .filter(order =>
        moment(order.lastUpdateTime).isAfter(
          moment().subtract(1, granularity).startOf(granularity)
        )
      )
      .filter(
        order =>
          (!selectedType || order.itemType === selectedType) &&
          (!selectedState || order.orderState === selectedState) &&
          (!selectedRegion || order.branch === selectedRegion)
      )

    const dataPoints = filteredData.reduce((result, order) => {
      let roundedTimestamp
      switch (granularity) {
        case "hour":
          roundedTimestamp = moment(order.lastUpdateTime)
            .startOf("hour")
            .toISOString()
          break
        case "day":
          roundedTimestamp = moment(order.lastUpdateTime)
            .startOf("hour")
            .toISOString()
          break
        case "week":
          roundedTimestamp = moment(order.lastUpdateTime)
            .startOf("day")
            .toISOString()
          break
        case "month":
          roundedTimestamp = moment(order.lastUpdateTime)
            .startOf("day")
            .toISOString()
          break
        default:
          roundedTimestamp = moment(order.lastUpdateTime).toISOString()
      }

      if (!result[roundedTimestamp]) {
        result[roundedTimestamp] = {count: 0, totalValue: 0}
      }
      result[roundedTimestamp].count += 1
      result[roundedTimestamp].totalValue += calculateTotalValue(order)
      return result
    }, {})

    const groupedData = Object.entries(dataPoints).map(
      ([timestamp, values]) => ({
        x: new Date(timestamp),
        y: values.count,
      })
    )

    const groupedTotalValueData = Object.entries(dataPoints).map(
      ([timestamp, values]) => ({
        x: new Date(timestamp),
        y: values.totalValue,
      })
    )

    return {groupedData, groupedTotalValueData}
  }

  const calculateDataPoints = () => {
    switch (selectedTimeRange) {
      case "hour":
        return groupOrdersByTimeGranularity("hour")
      case "day":
        return groupOrdersByTimeGranularity("day")
      case "week":
        return groupOrdersByTimeGranularity("week")
      case "month":
        return groupOrdersByTimeGranularity("month")
      default:
        return {groupedData: [], groupedTotalValueData: []}
    }
  }

  const {groupedData, groupedTotalValueData} = calculateDataPoints()

  const canvasJSData = [
    {
      type: "spline",
      dataPoints: groupedData,
      name: "Number of Orders",
    },
    {
      type: "spline",
      lineColor: "#51CDA0",
      color: "#51CDA0",
      axisYType: "secondary",
      dataPoints: groupedTotalValueData,
      name: "Total Value of Orders (Rupees)",
    },
  ]
  const getDefaultStartDate = () => {
    const currentDate = new Date()

    switch (selectedTimeRange) {
      case "hour":
        return moment(currentDate).subtract(1, "hour").toDate()
      case "day":
        return moment(currentDate).subtract(1, "day").toDate()
      case "week":
        return moment(currentDate).subtract(1, "week").toDate()
      case "month":
        return moment(currentDate).subtract(1, "month").toDate()
      default:
        return currentDate
    }
  }
  console.log(groupedData, "groupedData")
  const canvasJSOptions = {
    zoomEnabled: true,
    zoomType: "xy",
    exportEnabled: true,

    animationEnabled: true,
    title: {
      text: "Order Data",
    },
    charts: [
      {
        axisX: {
          title: "Time",
        },

        axisY: {
          title: "Number of Orders",
          titleFontColor: "#4F81BC",
          lineColor: "#4F81BC",
          tickColor: "#4F81BC",
          labelFontColor: "#4F81BC",
        },
        axisY2: {
          title: "Total Value of Orders (Rupees)",
          titleFontColor: "#51CDA0",
          lineColor: "#51CDA0",
          labelFontColor: "#51CDA0",
          tickColor: "#51CDA0",
          suffix: " Rs",
        },
        data: canvasJSData,
      },
    ],
    rangeSelector: {
      buttons: [],
      inputFields: {
        startValue: groupedData.length ? groupedData[0]["x"] : null,
        endValue: groupedData.length
          ? groupedData[groupedData.length - 1]["x"]
          : null,
      },
    },
    // rangeChanged: e => {
    //   if (e.trigger === "reset") {
    //     e.chart.options.axisX[0].viewportMinimum = null
    //     e.chart.options.axisX[0].viewportMaximum = null
    //     e.chart.render()
    //   }
    // },
  }
  // console.log(groupedData[0]["x"], "groupedData")
  const handleTypeSelect = e => {
    const type = e.dataPoint.label
    setSelectedType(type)
    setSelectedState("")
    setSelectedRegion("")
  }

  const handleStateSelect = e => {
    const type = e.dataPoint.label
    setSelectedState(type)
    setSelectedType("")
    setSelectedRegion("")
  }

  const handleRegionSelect = e => {
    const type = e.dataPoint.label2
    setSelectedRegion(Number(type))
    setSelectedState("")
    setSelectedType("")
  }

  const groupOrdersByType = () => {
    const dataPoints = formattedOrderData.reduce((result, order) => {
      const {itemType} = order
      if (!result[itemType]) {
        result[itemType] = 0
      }
      result[itemType] += 1
      return result
    }, {})

    return Object.entries(dataPoints).map(([type, count]) => ({
      label: type,
      y: count,
      click: handleTypeSelect,
    }))
  }

  const typeChartData = groupOrdersByType()

  const typeChartOptions = {
    animationEnabled: true,
    title: {
      text: "Orders by Type",
    },
    axisX: {
      title: "Type",
    },
    axisY: {
      title: "Number of Orders",
    },
    data: [
      {
        type: "column",
        dataPoints: typeChartData,
      },
    ],
  }

  const groupOrdersByState = () => {
    const dataPoints = formattedOrderData.reduce((result, order) => {
      const {orderState} = order
      if (!result[orderState]) {
        result[orderState] = 0
      }
      result[orderState] += 1
      return result
    }, {})

    return Object.entries(dataPoints).map(([state, count]) => ({
      label: state,
      y: count,
      click: handleStateSelect,
    }))
  }

  const stateChartData = groupOrdersByState()

  const stateChartOptions = {
    animationEnabled: true,
    title: {
      text: "Orders by State",
    },
    axisX: {
      title: "State",
    },
    axisY: {
      title: "Number of Orders",
    },
    data: [
      {
        type: "column",
        dataPoints: stateChartData,
      },
    ],
  }

  const groupTopBranches = () => {
    const dataPoints = formattedOrderData.reduce((result, order) => {
      const {branch} = order
      if (!result[branch]) {
        result[branch] = 0
      }
      result[branch] += 1
      return result
    }, {})

    const sortedBranches = Object.entries(dataPoints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    return sortedBranches.map(([branch, count]) => ({
      label: `Branch ${branch}`,
      label2: branch,
      y: count,
      click: handleRegionSelect,
    }))
  }

  const topBranchesChartData = groupTopBranches()

  const topBranchesChartOptions = {
    animationEnabled: true,
    title: {
      text: "Top 5 Branches",
    },
    axisX: {
      title: "Branch",
    },
    axisY: {
      title: "Number of Orders",
    },
    data: [
      {
        type: "column",
        dataPoints: topBranchesChartData,
      },
    ],
  }

  const wheelHandler = e => {
    e.preventDefault()

    if (
      e.clientX < chartRef.current.plotArea.x1 ||
      e.clientX > chartRef.current.plotArea.x2 ||
      e.clientY < chartRef.current.plotArea.y1 ||
      e.clientY > chartRef.current.plotArea.y2
    )
      return

    var axisX = chartRef.current.axisX[0]
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

    if (newViewportMin < chartRef.current.axisX[0].get("minimum"))
      newViewportMin = chartRef.current.axisX[0].get("minimum")

    if (newViewportMax > chartRef.current.axisX[0].get("maximum"))
      newViewportMax = chartRef.current.axisX[0].get("maximum")

    if (newViewportMax - newViewportMin > 2 * interval) {
      dataPointCounterRef.current = 0
      for (
        var i = 0;
        i < chartRef.current.options.data[0].dataPoints.length;
        i++
      ) {
        if (
          chartRef.current.options.data[0].dataPoints[i].x > newViewportMin &&
          chartRef.current.options.data[0].dataPoints[i].x < newViewportMax
        ) {
          dataPointCounterRef.current++
        }
      }

      if (dataPointCounterRef.current > 2) {
        chartRef.current.axisX[0].set("viewportMinimum", newViewportMin, false)
        chartRef.current.axisX[0].set("viewportMaximum", newViewportMax)
      }
    }
  }
  const containerProps = {
    width: "100%",
    height: "450px",
    margin: "auto",
  }
  return (
    <div>
      <h1>Analyst Dashboard</h1>
      <TimeSelector onSelectTimeRange={setSelectedTimeRange} />
      <div onWheel={wheelHandler}>
        <CanvasJSStockChart
          containerProps={containerProps}
          options={canvasJSOptions}
          onRef={ref => (chartRef.current = ref)}
        />
      </div>
      <CanvasJSChart options={typeChartOptions} />
      <CanvasJSChart options={stateChartOptions} />
      <CanvasJSChart options={topBranchesChartOptions} />
    </div>
  )
}

export default Dashboard
