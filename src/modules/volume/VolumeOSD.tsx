import { createBinding, createEffect, With } from "ags"
import { Astal, Gdk } from "ags/gtk4"
import AstalWp from "gi://AstalWp?version=0.1"
import app from "ags/gtk4/app"

const wp = AstalWp.get_default()!

export default function VolumeOSD({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  let win: Astal.Window
  let timeoutId: number | null = null

  const audio = wp.audio!
  const speaker = audio.defaultSpeaker!
  const volume = createBinding(speaker, "volume")
  const muted = createBinding(speaker, "mute")

  const showOSD = () => {
    if (win) {
      win.visible = true
    }

    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (win) {
        win.visible = false
      }
      timeoutId = null
    }, 1500)
  }

  // Show OSD when volume changes
  let lastVolume = volume.peek()
  createEffect(() => {
    const vol = volume()
    if (vol !== lastVolume) {
      lastVolume = vol
      showOSD()
    }
  })

  // Show OSD when mute changes
  createEffect(() => {
    muted()
    showOSD()
  })

  const volumePercentage = volume((vol) => Math.round(vol * 100))

  const labelText = muted((m) => (m ? "Muted" : `${volumePercentage.peek()}%`))

  return (
    <window
      $={(self) => {
        win = self
      }}
      visible={false}
      gdkmonitor={gdkmonitor}
      namespace="volume-osd"
      anchor={Astal.WindowAnchor.BOTTOM}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.NONE}
      application={app}
      cssClasses={["volume-osd"]}
    >
      <box orientation={1} spacing={8} cssClasses={["volume-osd-container"]}>
        {/* <label label={labelText} cssClasses={["volume-osd-label"]} /> */}
        <box cssClasses={["volume-osd-bar-container"]}>
          <With value={volumePercentage}>
            {(_volumePercentage) => (
              <box
                cssClasses={["volume-osd-bar-fill"]}
                width_request={volumePercentage}
                $={(self) => {
                  const percentage = muted.peek() ? 0 : _volumePercentage
                  print(percentage)
                  self.set_size_request(percentage * 3, -1)
                }}
              />
            )}
          </With>
        </box>
      </box>
    </window>
  )
}
