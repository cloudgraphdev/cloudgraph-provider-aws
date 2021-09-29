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

export const getDaysAgo = (days: number): string =>
  new Date(
    new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  ).toLocaleDateString('en-ca')

export const getFirstDayOfMonth = (): string => {
  const today = getDaysAgo(0).split('-')
  today.pop()
  today.push('01')
  return today.join('-')
}

export const getCurrentDayOfMonth = (): string => {
  const today = getDaysAgo(0).split('-')
  return today.pop()
}

export const createDiffSecs = (startDate: Date): number =>
  (new Date().getTime() - startDate.getTime()) / 1000
