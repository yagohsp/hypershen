import { With } from "ags"
import { createPoll } from "ags/time"
import GLib from "gi://GLib"
import Calendar from "../calendar/Calendar"

export function Clock() {
  const time = createPoll(
    "",
    1000,
    () => GLib.DateTime.new_now_local().format("%H:%M - %a %e/%m/%y")!,
  )

  return (
    <menubutton>
      <label label={time} />
      <popover>
        <Calendar />
      </popover>
    </menubutton>
  )
}
