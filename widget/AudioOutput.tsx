import { createBinding, For, createState, createComputed, With } from "ags"
import AstalWp from "gi://AstalWp"
import { Gtk } from "ags/gtk4"
import Gio from "gi://Gio"
import Pango from "gi://Pango"

const apps = Gio.app_info_get_all()

const iconCache: Record<string, Gio.Icon> = {}

function fetchIcon(appName: string) {
  const key = appName?.toLowerCase() ?? ""
  if (!key) return
  if (iconCache[key]) return iconCache[key]

  const found = apps.find((a) => a.get_name().toLowerCase().includes(key))
  const icon = found?.get_icon()
  if (!icon) return

  iconCache[key] = icon
  return icon
}

export function AudioOutput() {
  const wp = AstalWp.get_default()
  const [appsVolume, setAppVolumes] = createState<{
    [serial: string]: AstalWp.Stream
  }>({})

  wp.audio.connect("stream-added", (_, stream) => {
    const appName = stream.get_description()
    if (!appName) return

    const _appsVolume = { ...appsVolume.get() }
    _appsVolume[stream.serial] = stream
    setAppVolumes(_appsVolume)
  })

  wp.audio.connect("stream-removed", (_, stream) => {
    const appName = stream.get_description()
    if (!appName) return

    const _appsVolume = appsVolume.get()
    delete _appsVolume[stream.serial]
    setAppVolumes(_appsVolume)
  })

  const appVolumesList = createComputed((get) => {
    const apps = get(appsVolume)

    const appsSorted = Object.values(apps).sort((a, b) => {
      if (a.description > b.description) return 1
      return -1
    })

    return appsSorted
  })

  return (
    <menubutton class="audio-menu-button">
      <image iconName={createBinding(wp.defaultSpeaker, "volumeIcon")} />
      <popover>
        <box
          spacing={10}
          orientation={Gtk.Orientation.VERTICAL}
          class="audio-output-list"
        >
          <box>
            <slider
              onChangeValue={({ value }) => wp.defaultSpeaker.set_volume(value)}
              value={createBinding(wp.defaultSpeaker, "volume")}
              min={0}
              max={1}
              hexpand
            />
          </box>

          <For each={appVolumesList}>
            {(stream) => {
              const icon = fetchIcon(stream.description.toLowerCase())
              const muted = createBinding(stream, "mute")
              return (
                <box
                  spacing={10}
                  orientation={Gtk.Orientation.HORIZONTAL}
                  class="audio-item"
                >
                  <box>
                    <With value={muted}>
                      {(value) => (
                        <button
                          onClicked={() => stream.set_mute(!stream.mute)}
                          class={value ? "audio-button-muted" : "audio-button"}
                        >
                          {icon ? (
                            <image
                              icon_size={Gtk.IconSize.LARGE}
                              gicon={icon}
                            />
                          ) : (
                            <image
                              icon_size={Gtk.IconSize.LARGE}
                              iconName={stream.icon}
                            />
                          )}
                        </button>
                      )}
                    </With>
                  </box>
                  <label
                    class="audio-name"
                    label={stream.name}
                    maxWidthChars={1}
                    ellipsize={Pango.EllipsizeMode.END}
                    hexpand
                    xalign={0}
                  />
                  {/* <label */}
                  {/*   class="audio-description" */}
                  {/*   label={stream.description} */}
                  {/*   maxWidthChars={10} */}
                  {/*   ellipsize={Pango.EllipsizeMode.END} */}
                  {/*   hexpand */}
                  {/*   halign={Gtk.Align.START} */}
                  {/* /> */}
                  <slider
                    class="audio-slider"
                    value={stream.volume}
                    min={0}
                    max={1}
                    onChangeValue={(e) => {
                      stream.set_volume(e.value)
                    }}
                  />
                </box>
              )
            }}
          </For>
        </box>
      </popover>
    </menubutton>
  )
}
