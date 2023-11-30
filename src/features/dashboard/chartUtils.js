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

export const zoomHandler = (e, chartRef, dataPointCounterRef) => {
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
