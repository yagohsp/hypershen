import { Gdk, Gtk } from "ags/gtk4"
import AstalNetwork from "gi://AstalNetwork"
import { createBinding } from "gnim"

export default function Network() {
  const network = AstalNetwork.get_default()

  const state = createBinding(network.wired, "state")

  const theme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
  for (const name of theme.iconNames || []) {
    if (name.includes("wireless") || name.includes("network")) {
      print(name)
    }
  }

  const info = theme.lookup_icon("radiowaves-1-symbolic", [], 48, 1, null, null)

  return <image iconName="preferences-desktop-accessibility" />
}
