import AstalHyprland from "gi://AstalHyprland?version=0.1"
import { createBinding, createEffect, For } from "ags"
import { Gtk } from "ags/gtk4"
import Gdk from "gi://Gdk"

const ACTIVE_IMAGE = "/home/yago/y/hypershen/src/assets/workspace-active.png"
const INACTIVE_IMAGE =
  "/home/yago/y/hypershen/src/assets/workspace-inactive.png"

type WorkspaceButtonProps = {
  ws: AstalHyprland.Workspace
}

function WorkspaceButton({ ws }: WorkspaceButtonProps) {
  let button: Gtk.Button
  let image: Gtk.Image
  const hyprland = AstalHyprland.get_default()
  const focusedWorkspace = createBinding(hyprland, "focusedWorkspace")
  const clients = createBinding(hyprland, "clients")

  const updateState = (
    focused: AstalHyprland.Workspace,
    allClients: AstalHyprland.Client[],
  ) => {
    const isActive = focused.id === ws.id
    const hasClients = allClients.some((c) => c.workspace.id === ws.id)

    try {
      if (isActive) {
        const texture = Gdk.Texture.new_from_filename(ACTIVE_IMAGE)
        image.set_from_paintable(texture)
        button.add_css_class("active")
      } else {
        const texture = Gdk.Texture.new_from_filename(INACTIVE_IMAGE)
        image.set_from_paintable(texture)
        button.remove_css_class("active")
      }
    } catch (e) {
      console.error("Failed to load workspace image:", e)
    }

    if (hasClients) {
      button.add_css_class("occupied")
    } else {
      button.remove_css_class("occupied")
    }
  }

  createEffect(() => {
    updateState(focusedWorkspace(), clients())
  })

  return (
    <button
      $={(self) => {
        button = self
      }}
      cssClasses={["workspace-button"]}
      onClicked={() => ws.focus()}
      focusOnClick={false}
      tooltipText={`Workspace ${ws.id}`}
    >
      <image
        $={(self) => {
          image = self
          try {
            const isActive = focusedWorkspace.peek().id === ws.id
            const texture = Gdk.Texture.new_from_filename(
              isActive ? ACTIVE_IMAGE : INACTIVE_IMAGE,
            )
            image.set_from_paintable(texture)
          } catch (e) {
            console.error("Failed to load initial workspace image:", e)
          }
        }}
        pixelSize={28}
      />
    </button>
  )
}

type WorkspacesProps = {
  gdkmonitor: Gdk.Monitor
}

export default function Workspaces({ gdkmonitor }: WorkspacesProps) {
  const hyprland = AstalHyprland.get_default()
  const workspaces = createBinding(hyprland, "workspaces")

  const hyprMonitors = hyprland.get_monitors()
  const gdkConnector = gdkmonitor.get_connector()

  const hyprMonitor = hyprMonitors.find((m) => m.name === gdkConnector)

  if (!hyprMonitor) {
    const allWorkspaces = workspaces((wsList) =>
      wsList.sort((a, b) => a.id - b.id),
    )

    return (
      <box cssClasses={["workspace-container"]} spacing={4}>
        <For each={allWorkspaces}>{(ws) => <WorkspaceButton ws={ws} />}</For>
      </box>
    )
  }

  const monitorWorkspaces = workspaces((wsList) =>
    wsList
      .filter((ws) => ws.monitor?.id === hyprMonitor.id)
      .sort((a, b) => a.id - b.id),
  )

  return (
    <box cssClasses={["workspace-container"]} spacing={8}>
      <For each={monitorWorkspaces}>{(ws) => <WorkspaceButton ws={ws} />}</For>
    </box>
  )
}
