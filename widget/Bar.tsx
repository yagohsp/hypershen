import app from "ags/gtk4/app"
import Astal from "gi://Astal?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { onCleanup } from "ags"
import { AudioOutput } from "./AudioOutput"
import Time from "./Time"
import NotificationPopups from "./notifications/NotificationPopups"
import { Gtk } from "ags/gtk4"

export default function Bar({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  let win: Astal.Window
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <>
      <window
        $={(self) => {
          win = self
        }}
        visible
        class="main-bar"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
        application={app}
      >
        <centerbox>
          <box spacing={12} $type="end">
            <AudioOutput />
            <Gtk.Separator visible />
            <Time />
            {/* <Network /> */}
            {/* <Icons /> */}
          </box>
        </centerbox>
      </window>

      <NotificationPopups monitor={gdkmonitor} />
    </>
  )
}
