import { useState } from 'react'
import { format } from 'date-fns'
import styled from 'styled-components'

import { Slot } from './Slot'
import { Button } from './Button'

// TODO: This file could very easily be broken down into parts, but left it in one for each of review

const PAGE_SIZE = 4

const StyledDayList = styled.div`
  ul {
    margin: 0;
    padding: 0;
    width: 100%;

    /* This could be display grid wiht some adjustments */
    display: flex;
    list-style: none;

    border: 1px solid black;
  }
`

const Day = styled.li`
  flex: 1;
  text-align: center;
  border-right: 1px solid black;

  display: flex;
  flex-direction: column;

  &:last-child {
    border-right: 0;
  }

  .title,
  .slot {
    margin: 0;
    padding: 12px;
    border-bottom: 1px solid black;
  }

  .title {
    flex: 1;
  }

  *:last-child {
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
    const dayText = format(day.date, 'E do MMMM')
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
        <p className="title">{dayText}</p>
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
      <Button onClick={todayPage} disabled={page === 0}>
        Today
      </Button>
      <Button onClick={prevPage} disabled={page === 0}>
        Prev
      </Button>
      <Button onClick={nextPage} disabled={page >= maxPage}>
        Next
      </Button>

      <ul>{nodes}</ul>
    </StyledDayList>
  )
}
