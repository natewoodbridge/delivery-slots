import styled from 'styled-components'

const StyledSlot = styled.p`
  cursor: pointer;

  ${(props) =>
    (props.isFull || !props.isAvaliable) &&
    `
      cursor: default;
      background: pink;
    `};

  ${(props) =>
    props.isSelected &&
    `
      background: #7fdc7f;
    `};
`

export const Slot = ({ prettyDate, meta, selectSlot, isSelected }) => {
  const { code, bookings, avaliable, capacity } = meta
  const handleClick = () => selectSlot({ slotDate: prettyDate, slotCode: code })

  // TODO: More robust logic could be put here to make sure that if capacity changed, a booking could not be made
  const isFull = bookings >= capacity

  return (
    <StyledSlot
      key={code}
      isFull={isFull}
      isSelected={isSelected}
      isAvaliable={avaliable}
      onClick={isFull ? undefined : handleClick}
      title={`Debug Total bookings = ${bookings}`}
    >
      {code}
    </StyledSlot>
  )
}
