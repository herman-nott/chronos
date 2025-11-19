export default function Task(newTask) {
  return (
    <div >
      <input type='radio-button' className={`${newEventOpen ? 'rotate-0' : 'rotate-180'}`} />
      <span></span>
    </div>
  )
}