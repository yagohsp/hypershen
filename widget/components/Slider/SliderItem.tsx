import AstalWp from "gi://AstalWp"
import { SliderIcon } from "./SliderIcon"
import Pango from "gi://Pango?version=1.0"
import GLib from "gi://GLib?version=2.0"

function getIconByPid(pid: number) {
  try {
    const exe = GLib.file_read_link(`/proc/${pid}/exe`)
    print(exe)
  } catch (e) {
    log(`exePathForPid error: ${e}`)
    return null
  }
}

export const SliderItem = ({ type, stream }: SliderItemProps): JSX.Element => {
  return (
    <box class="audio-output-item">
      <label
        xalign={0}
        ellipsize={Pango.EllipsizeMode.END}
        maxWidthChars={1}
        hexpand
        label={`${stream.description} - ${stream.name}`}
      />
      <image file={stream.icon} />
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
    </box>
  )
}

interface SliderItemProps {
  type: "playback" | "input"
  stream: AstalWp.Stream
}
