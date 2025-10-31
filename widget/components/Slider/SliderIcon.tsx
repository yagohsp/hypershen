import { createBinding, createComputed, createState } from "ags"
import { Gtk } from "ags/gtk4"
import AstalWp from "gi://AstalWp"

const speakerIcons = {
  101: "audio-volume-overamplified-symbolic",
  66: "audio-volume-high-symbolic",
  34: "audio-volume-medium-symbolic",
  1: "audio-volume-low-symbolic",
  0: "audio-volume-muted-symbolic",
} as const

const inputIcons = {
  101: "microphone-sensitivity-high-symbolic",
  66: "microphone-sensitivity-high-symbolic",
  34: "microphone-sensitivity-medium-symbolic",
  1: "microphone-sensitivity-low-symbolic",
  0: "microphone-disabled-symbolic",
}

type IconVolumes = keyof typeof speakerIcons

const getIcon = (
  audioVol: number,
  isMuted: boolean,
): Record<string, string> => {
  const thresholds: IconVolumes[] = [101, 66, 34, 1, 0]
  const icon = isMuted
    ? 0
    : (thresholds.find((threshold) => threshold <= audioVol * 100) ?? 0)

  return {
    spkr: speakerIcons[icon],
    mic: inputIcons[icon],
  }
}

export const SliderIcon = ({ type, stream }: SliderIconProps): JSX.Element => {
  const iconBinding = createComputed(
    [createBinding(stream, "volume"), createBinding(stream, "mute")],
    (volume, isMuted) => {
      const iconType = type === "playback" ? "spkr" : "mic"

      const effectiveVolume = volume > 0 ? volume : 100
      const mutedState = volume > 0 ? isMuted : true

      return getIcon(effectiveVolume, mutedState)[iconType]
    },
  )

  return (
    <button
      vexpand={false}
      valign={Gtk.Align.END}
      onClicked={() => {
        stream.set_mute(!stream.mute)
      }}
    >
      <image iconName={iconBinding} pixelSize={16} />
    </button>
  )
}

interface SliderIconProps {
  type: "playback" | "input"
  stream: AstalWp.Stream
}
