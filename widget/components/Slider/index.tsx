import { Gtk } from "ags/gtk4"
import AstalWp from "gi://AstalWp"
import { createBinding } from "gnim"

export const Slider = ({ device, type }: SliderProps): JSX.Element => {
  return (
    <box>
      <label
        halign={Gtk.Align.START}
        hexpand
        wrap
        label={createBinding(device, "description")}
      />
      <slider
        value={createBinding(device, "volume")}
        drawValue={false}
        hexpand
        min={0}
      />
    </box>
  )
}

interface SliderProps {
  device: AstalWp.Endpoint
  type: "playback" | "input"
}
