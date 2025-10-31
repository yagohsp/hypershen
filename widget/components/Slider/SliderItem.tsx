import AstalWp from "gi://AstalWp"
import { SliderIcon } from "./SliderIcon"
import Pango from "gi://Pango?version=1.0"

export const SliderItem = ({ type, stream }: SliderItemProps): JSX.Element => {
  return (
    <box class="audio-output-item">
      <label
        xalign={0}
        ellipsize={Pango.EllipsizeMode.END}
        maxWidthChars={1}
        hexpand
        label={stream.name}
      />
      <SliderIcon type={type} stream={stream} />
      <slider
        class="audio-slider"
        value={stream.volume}
        min={0}
        max={1}
        onChangeValue={(value) => {
          stream.set_volume(value.value)
        }}
      />

      {/* <Slider type={type} stream={stream} /> */}
      {/* <SliderPercentage type={type} stream={stream} /> */}
    </box>
  )
}

interface SliderItemProps {
  type: "playback" | "input"
  stream: AstalWp.Stream
}
