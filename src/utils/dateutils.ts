import t from '../properties/translations'

const oneDay = 86400
const oneHour = 3600
const oneMinute = 60

export default (seconds: string): string => {
  const numberOfSeconds = parseInt(seconds, 10)
  if (numberOfSeconds >= oneDay) {
    return `${(numberOfSeconds / oneDay).toFixed()} ${t.days}`
  }
  if (numberOfSeconds >= oneHour) {
    return `${(numberOfSeconds / oneHour).toFixed()} ${t.hours}`
  }
  if (numberOfSeconds >= oneMinute) {
    return `${(numberOfSeconds / oneMinute).toFixed()} ${t.minutes}`
  }
  return `${numberOfSeconds} ${t.seconds}`.toLowerCase()
}
