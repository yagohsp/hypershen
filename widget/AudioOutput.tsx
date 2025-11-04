import { createBinding, For, createState, createComputed } from "ags"
import AstalWp from "gi://AstalWp"
import { Gtk } from "ags/gtk4"
import Gio from "gi://Gio?version=2.0"

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
  const [appsVolume, setAppVolumes] = createState<
    Map<
      string,
      {
        volume: number
        streams: Map<number, AstalWp.Stream>
      }
    >
  >(new Map())

  wp.audio.connect("stream-added", (_, stream) => {
    const appName = stream.get_description()
    if (!appName) return
    const _appsVolume = appsVolume.get()

    const app = _appsVolume.get(appName)
    if (!app) {
      const streamsMap = new Map()
      streamsMap.set(stream.id, stream)

      _appsVolume.set(appName, {
        volume: stream.volume,
        streams: streamsMap,
      })
      setAppVolumes(new Map(_appsVolume.entries()))
      return
    }

    if (!app.streams.get(stream.id)) {
      stream.set_volume(app.volume)

      app.streams.set(stream.id, stream)

      _appsVolume.set(appName, {
        volume: stream.volume,
        streams: app.streams,
      })
      setAppVolumes(new Map(_appsVolume.entries()))
    }
  })

  function handleChangeVolume(appName: string, volume: number) {
    const apps = appsVolume.get()
    const app = apps.get(appName)
    if (!app) return

    app!.streams.forEach((stream) => {
      stream.set_volume(volume)
    })
  }

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
          <For each={appsVolume}>
            {(appVolume) => {
              const [appName, { volume }] = appVolume
              return (
                <box class="audio-output-item">
                  <image
                    icon_size={Gtk.IconSize.LARGE}
                    gicon={fetchIcon(appName)}
                  />
                  <slider
                    class="audio-slider"
                    value={volume}
                    min={0}
                    max={1}
                    onChangeValue={(value) => {
                      handleChangeVolume(appName, value.value)
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
