import { useState } from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'

import { Slot } from './Slot'

const PAGE_SIZE = 4

const StyledDayList = styled.div`
  ul {
    margin: 0;
    padding: 0;
    width: 100%;

    display: flex;

    list-style: none;

    border: 1px solid black;
  }
`

const Day = styled.li`
  flex: 1;
  text-align: center;
  border-right: 1px solid black;

  &:last-child {
    border-right: 0;
  }

  > * {
    margin: 0;
    padding: 12px;
    border-bottom: 1px solid black;
  }

  > *:last-child {
    border-bottom: 0;
  }
`

export const DayList = ({ days, selectSlot, selectedSlot }) => {
  const [page, setPage] = useState(0)

  const firstDay = days[0] || []
  const isFirstFull = firstDay.slots.every(
    (item) => item.bookings >= item.capacity
  )

  // TODO: Need a nicer way of doing this, that is unmutable, maybe a slice
  if (isFirstFull) {
    days.shift()
  }

  const startingItem = page * PAGE_SIZE
  const activeDays = days.slice(startingItem, startingItem + PAGE_SIZE)

  const nodes = activeDays.map((day) => {
    const dayText = format(day.date, 'do MMMM')
    const slots = day.slots.map((slot) => {
      const { code } = slot

      const isSelected =
        selectedSlot &&
        day.prettyDate === selectedSlot.slotDate &&
        code === selectedSlot.slotCode

      return (
        <Slot
          key={`${day.prettyDate}_${code}`}
          prettyDate={day.prettyDate}
          meta={slot}
          selectSlot={selectSlot}
          isSelected={isSelected}
        />
      )
    })

    return (
      <Day key={day.prettyDate}>
        <p>{dayText}</p>
        {slots}
      </Day>
    )
  })

  const maxPage = days.length / PAGE_SIZE - 1

  const prevPage = () => setPage(page - 1)
  const nextPage = () => setPage(page + 1)
  const todayPage = () => setPage(0)

  return (
    <StyledDayList>
      <button onClick={todayPage} disabled={page === 0}>
        Today
      </button>
      <button onClick={prevPage} disabled={page === 0}>
        Prev
      </button>
      <ul>{nodes}</ul>
      <button onClick={nextPage} disabled={page >= maxPage}>
        Next
      </button>
    </StyledDayList>
  )
}
