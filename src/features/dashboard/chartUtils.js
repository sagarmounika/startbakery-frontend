export const groupOrders = (orders, propertyKey, onClickHandler) => {
  const dataPoints = orders.reduce((result, order) => {
    const propertyValue = order[propertyKey]
    if (!result[propertyValue]) {
      result[propertyValue] = 0
    }
    result[propertyValue] += 1
    return result
  }, {})
  if (propertyKey === "branch") {
    const sortedBranches = Object.entries(dataPoints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
    return sortedBranches.map(([branch, count]) => ({
      label: `Branch ${branch}`,
      label2: branch,
      y: count,
      click: onClickHandler,
    }))
  }
  return Object.entries(dataPoints).map(([value, count]) => ({
    label: value,
    y: count,
    click: onClickHandler,
  }))
}

export const zoomHandler = (chart,e) => {
  if (
    e.clientX < chart.plotArea.x1 ||
    e.clientX > chart.plotArea.x2 ||
    e.clientY < chart.plotArea.y1 ||
    e.clientY > chart.plotArea.y2
  )
    return

  var xValue = Math.round(chart?.axisX[0]?.convertPixelToValue(e.clientX))
  var yValue = Math.round(chart?.axisY[0]?.convertPixelToValue(e.clientY))

  var axisXViewportMin = chart?.axisX[0]?.get("viewportMinimum"),
    axisXViewportMax = chart?.axisX[0]?.get("viewportMaximum"),
    axisYViewportMin = chart?.axisY[0]?.get("viewportMinimum"),
    axisYViewportMax = chart?.axisY[0]?.get("viewportMaximum"),
    axisXMin = chart?.axisX[0]?.get("minimum"),
    axisXMax = chart?.axisX[0]?.get("maximum"),
    axisYMin = chart?.axisY[0]?.get("minimum"),
    axisYMax = chart?.axisY[0]?.get("maximum"),
    axisXInterval = chart?.axisX[0]?.interval,
    axisYInterval = chart?.axisY[0]?.interval

  var newAxisXViewportMin,
    newAxisXViewportMax,
    newAxisYViewportMin,
    newAxisYViewportMax

  if (e.deltaY < 0) {
    newAxisXViewportMin =
      axisXViewportMin + (xValue - axisXViewportMin) / axisXInterval
    newAxisXViewportMax =
      axisXViewportMax - (axisXViewportMax - xValue) / axisXInterval

    newAxisYViewportMin =
      axisYViewportMin + (yValue - axisYViewportMin) / axisYInterval
    newAxisYViewportMax =
      axisYViewportMax - (axisYViewportMax - yValue) / axisYInterval
  } else if (e.deltaY > 0) {
    newAxisXViewportMin =
      axisXViewportMin - (xValue - axisXViewportMin) / axisXInterval >= axisXMin
        ? axisXViewportMin - (xValue - axisXViewportMin) / axisXInterval
        : axisXMin
    newAxisXViewportMax =
      axisXViewportMax + (axisXViewportMax - xValue) / axisXInterval <= axisXMax
        ? axisXViewportMax + (axisXViewportMax - xValue) / axisXInterval
        : axisXMax

    newAxisYViewportMin =
      axisYViewportMin - (yValue - axisYViewportMin) / axisYInterval >= axisYMin
        ? axisYViewportMin - (yValue - axisYViewportMin) / axisYInterval
        : axisYMin
    newAxisYViewportMax =
      axisYViewportMax + (axisYViewportMax - yValue) / axisYInterval <= axisYMax
        ? axisYViewportMax + (axisYViewportMax - yValue) / axisYInterval
        : axisYMax
  }

  if (
    newAxisXViewportMin >= axisXMin &&
    newAxisXViewportMax <= axisXMax &&
    newAxisXViewportMax - newAxisXViewportMin > 2 * axisXInterval &&
    newAxisYViewportMin >= axisYMin &&
    newAxisYViewportMax <= axisYMax &&
    newAxisYViewportMax - newAxisYViewportMin > 2 * axisYInterval
  ) {
    chart?.axisX[0]?.set("viewportMinimum", newAxisXViewportMin, false)
    chart?.axisX[0].set("viewportMaximum", newAxisXViewportMax, false)

    chart?.axisY[0]?.set("viewportMinimum", newAxisYViewportMin, false)
    chart?.axisY[0]?.set("viewportMaximum", newAxisYViewportMax)
  }
}
