import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { onCleanup } from "ags"
import NetworkStatus from "../network/NetworkStatus"
import VolumeControl from "../volume/VolumeControl"
import AudioOutputButtons from "../volume/AudioOutputButtons"
import Workspaces from "../workspaces/Workspaces"
import { Clock } from "../clock/Clock"

function Start({ gdkmonitor }: { gdkmonitor: Gdk.Monitor }) {
  return (
    <box $type="start" class="start">
      <Workspaces gdkmonitor={gdkmonitor} />
    </box>
  )
}

function Center() {
  return <box $type="center" class="center" />
}

function End() {
  return (
    <box $type="end" class="end">
      <NetworkStatus />
      <VolumeControl />
      <AudioOutputButtons />
      <Clock />
    </box>
  )
}

type BarProps = JSX.IntrinsicElements["window"] & {
  gdkmonitor: Gdk.Monitor
}

export default function Bar({ gdkmonitor, ...props }: BarProps) {
  let win: Astal.Window
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  onCleanup(() => {
    // Root components (windows) are not automatically destroyed.
    // When the monitor is disconnected from the system, this callback
    // is run from the parent <For> which allows us to destroy the window
    win.destroy()
  })

  return (
    <window
      visible
      $={(self) => {
        win = self
        // Fix for bar size changes via margin/padding
        self.set_default_size(1, 1)
      }}
      name={"bar"}
      namespace={"bar"}
      gdkmonitor={gdkmonitor}
      anchor={TOP | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      application={app}
      {...props}
    >
      <centerbox cssClasses={["bar-container"]}>
        <Start gdkmonitor={gdkmonitor} />
        <Center />
        <End />
      </centerbox>
    </window>
  )
}
