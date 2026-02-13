import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { onCleanup } from "ags"
import NetworkStatus from "../network/NetworkStatus"
import VolumeControl from "../volume/VolumeControl"
import Workspaces from "../workspaces/Workspaces"
import { Clock } from "../clock/Clock"
import PowerMenu from "../power/PowerMenu"

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
      <Clock />
      <PowerMenu />
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
    win.destroy()
  })

  return (
    <window
      visible
      $={(self) => {
        win = self
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
