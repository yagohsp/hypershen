import { createPoll } from "ags/time"

export default function Time() {
  const time = createPoll("", 1000, 'date +"%H:%M - %d/%m - %a"')
  return <label label={time} />
}
