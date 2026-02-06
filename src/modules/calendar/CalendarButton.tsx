import Calendar from "./Calendar"

export default function CalendarButton() {
  return (
    <menubutton>
      <label label="Calendar" />
      <popover>
        <Calendar />
      </popover>
    </menubutton>
  )
}
