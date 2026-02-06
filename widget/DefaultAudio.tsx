import {
  createBinding,
  For,
  createState,
  createComputed,
  With,
  Fragment,
} from "ags"
import AstalWp from "gi://AstalWp"
import { Gtk } from "ags/gtk4"
import Pango from "gi://Pango"

export default function DefaultAudio() {
  const wp = AstalWp.get_default()
  const [speakers, setSpeakers] = createState<{
    [serial: string]: AstalWp.Endpoint
  }>({})

  wp.audio.connect("speaker-added", (_, stream) => {
    const _speakers = { ...speakers.get() }
    _speakers[stream.serial] = stream
    setSpeakers(_speakers)
  })

  wp.audio.connect("speaker-removed", (_, stream) => {
    const _speakers = speakers.get()
    delete _speakers[stream.serial]
    setSpeakers(_speakers)
  })

  const deviceList = createComputed((get) => {
    const devices = get(speakers)

    const devicesSorted = Object.values(devices).sort((a, b) => {
      if (a.device.description > b.device.description) return 1
      return -1
    })

    return devicesSorted
  })

  return (
    <box class="speakers">
      <For each={deviceList}>
        {(stream, _i) => {
          const _is_default = createBinding(stream, "is_default")

          return (
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
              <With value={_is_default}>
                {(is_default) => (
                  <button
                    onClicked={() => {
                      stream.set_is_default(true)
                      setSpeakers(speakers.get())
                    }}
                    tooltipText={stream.device.description}
                    class={is_default ? "active" : ""}
                    valign={Gtk.Align.START}
                  >
                    <With value={_i}>
                      {(i) => <label label={`Audio ${i}`} />}
                    </With>
                  </button>
                )}
              </With>
            </box>
          )
        }}
      </For>
    </box>
  )
}
