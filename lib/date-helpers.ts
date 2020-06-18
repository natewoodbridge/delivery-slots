import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import { add } from 'date-fns'

export const getDatesArray = (daysDuration = 30) => {
  const end = add(new Date(), { days: daysDuration })

  const days = eachDayOfInterval({ start: new Date(), end: end })

  return days
}
