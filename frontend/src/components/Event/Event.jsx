import EventPopup from "./EventPopup"
export default function Event(newEvent) {
  return (
    <div classVame="event-container" onClik={}>
        <span>{newEvent.title}</span>
        <span>{newEvent.start_time}-{newEvent.end_time}</span>
    </div>
  )
}