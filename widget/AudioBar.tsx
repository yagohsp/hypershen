import { Astal } from "ags/gtk4"
import AstalWp from "gi://AstalWp"
import { createBinding, With } from "gnim"

export default function AudioBar() {
  const wp = AstalWp.get_default()
  const defaultSpeaker = wp.audio.get_default_speaker()
  const volume = createBinding(defaultSpeaker, "volume")
  return (
    <window
      visible
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
      marginLeft={30}
      marginTop={50}
    >
      <box class="audio-bar">
        <With value={volume}>
          {(value) => <label label={Math.trunc(value * 100).toString()} />}
        </With>
      </box>
    </window>
  )
}
