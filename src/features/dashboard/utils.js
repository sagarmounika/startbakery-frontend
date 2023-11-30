// utils.js
import moment from "moment"

export const calculateTotalValue = order => {
  return order.qty * getPriceByItemType(order.itemType)
}

export const getPriceByItemType = itemType => {
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

export const groupOrdersByTimeGranularity = (
  ordersData,
  selectedTimeRange,
  selectedType,
  selectedState,
  selectedRegion
) => {
  const filteredData = ordersData.filter(
    order =>
      (!selectedType || order.itemType === selectedType) &&
      (!selectedState || order.orderState === selectedState) &&
      (!selectedRegion || order.branch === selectedRegion)
  )

  const dataPoints = filteredData.reduce((result, order) => {
    let roundedTimestamp
    switch (selectedTimeRange) {
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

  const groupedData = Object.entries(dataPoints).map(([timestamp, values]) => ({
    x: new Date(timestamp),
    y: values.count,
  }))

  const groupedTotalValueData = Object.entries(dataPoints).map(
    ([timestamp, values]) => ({
      x: new Date(timestamp),
      y: values.totalValue,
    })
  )

  return {groupedData, groupedTotalValueData}
}
