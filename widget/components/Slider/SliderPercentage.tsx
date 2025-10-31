import { Gtk } from "ags/gtk4"
import AstalWp from "gi://AstalWp"
import { createBinding } from "gnim"

export const SliderPercentage = ({
  type,
  device,
}: SliderPercentageProps): JSX.Element => {
  return (
    <label
      valign={Gtk.Align.END}
      label={createBinding(device, "volume").as(
        (vol) => `${Math.round(vol * 100)}%`,
      )}
    />
  )
}

interface SliderPercentageProps {
  type: "playback" | "input"
  device: AstalWp.Endpoint
}
