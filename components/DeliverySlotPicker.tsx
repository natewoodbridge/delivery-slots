import { useState } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

import { format, getWeek, isFriday, isWednesday, isToday } from 'date-fns'

import { getDatesArray } from '../lib/date-helpers'
import { DayList } from './DayList'

export const GET_BOOKINGS_QUERY = gql`
  {
    bookings {
      slotDate
      bookingId
      slotCode
    }
  }
`

const CREATE_BOOKING_MUTATION = gql`
  mutation CREATE_BOOKING($slotDate: String!, $slotCode: String!) {
    createBooking(slotDate: $slotDate, slotCode: $slotCode) {
      slotDate
      bookingId
      slotCode
    }
  }
`

const getBookingTotal = (bookingsTotals, key) => bookingsTotals[key] || 0

const getSlotConfig = ({
  code,
  date,
  prettyDate,
  bookingsTotals,
  restrictedItem,
}) => {
  const capacity = 3
  let avaliable = true

  const bookings = getBookingTotal(bookingsTotals, `${prettyDate}_${code}`)

  // Every second (odd) Friday AM slot is not avalaible
  if (getWeek(date) % 2 === 1 && isFriday(date) && code === 'AM') {
    avaliable = false
  }

  if (restrictedItem && isWednesday(date)) {
    avaliable = false
  }

  return {
    code,
    bookings,
    capacity,
    avaliable,
  }
}

const createSlotsList = ({ next30Days, bookings, restrictedItem }) => {
  // Placed here, to only caculate the totals once, could move into getBookingTotal, and memorise value
  const bookingsTotals = bookings.reduce((acc, item) => {
    const key = `${item.slotDate}_${item.slotCode}`
    const count = acc[key] || 0
    acc[key] = count + 1
    return acc
  }, {})

  const daysWithSlots = next30Days.map((date) => {
    const prettyDate = format(date, 'yyyy-MM-dd')

    const slotConfig = {
      date,
      prettyDate,
      bookingsTotals,
      restrictedItem,
    }

    const dayWithBooking = {
      date,
      prettyDate,
      slots: [
        getSlotConfig({ code: 'AM', ...slotConfig }),
        getSlotConfig({ code: 'PM', ...slotConfig }),
        getSlotConfig({ code: 'EVE', ...slotConfig }),
      ],
    }

    return dayWithBooking
  })

  return daysWithSlots
}

export const DeliverySlotPicker = ({ restrictedItem }) => {
  const [selectedSlot, selectSlot] = useState(null)

  const { data, loading, error } = useQuery(GET_BOOKINGS_QUERY)
  const [addBooking, { loading: loadingMutation }] = useMutation(
    CREATE_BOOKING_MUTATION,
    {
      refetchQueries: [
        {
          query: GET_BOOKINGS_QUERY,
        },
      ],
      onCompleted: () => {
        selectSlot(null)
      },
    }
  )

  // if(loadingMutation) return <div>Loading...</div>

  if (loading) return <div>Loading...</div>
  if (error) return <div>Failed to load</div>

  const { bookings } = data

  const next30Days = getDatesArray(30)
  const days = createSlotsList({ next30Days, bookings, restrictedItem })

  const handleAddBooking = () => {
    if (!selectedSlot) return

    const { slotDate, slotCode } = selectedSlot
    addBooking({
      variables: { slotDate, slotCode },
    })
  }

  return (
    <>
      <p>
        Selected Slot:{' '}
        {selectedSlot ? (
          <span>
            {selectedSlot.slotDate} {selectedSlot.slotCode}
          </span>
        ) : (
          'None'
        )}{' '}
        <span onClick={() => selectSlot(null)}>
          <em>Remove</em>
        </span>
      </p>
      <DayList
        days={days}
        selectSlot={selectSlot}
        selectedSlot={selectedSlot}
      />
      <button onClick={handleAddBooking} disabled={selectedSlot ? false : true}>
        Reserve Slot
      </button>
    </>
  )
}
