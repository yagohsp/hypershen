import { createBinding, For } from "ags"
import AstalWp from "gi://AstalWp"
import { SliderItem } from "./components/Slider/SliderItem"
import { Gtk } from "ags/gtk4"

export function AudioOutput() {
  const wp = AstalWp.get_default()

  const v = createBinding(wp.audio, "streams")

  v((v) => v)

  return (
    <menubutton class="audio-menu-button">
      <image iconName={createBinding(wp.defaultSpeaker, "volumeIcon")} />
      <popover>
        <box>
          <slider
            widthRequest={260}
            onChangeValue={({ value }) => wp.defaultSpeaker.set_volume(value)}
            value={createBinding(wp.defaultSpeaker, "volume")}
          />
        </box>

        <box orientation={Gtk.Orientation.VERTICAL} class="box">
          <For each={v}>
            {(stream) => {
              return <SliderItem type={"playback"} stream={stream} />
            }}
          </For>
        </box>
      </popover>
    </menubutton>
  )
}
