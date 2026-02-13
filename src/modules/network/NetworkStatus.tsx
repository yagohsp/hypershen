import { createBinding, For, With } from "ags"
import AstalNetwork from "gi://AstalNetwork?version=0.1"

const network = AstalNetwork.get_default()

export default function NetworkStatus() {
  const wifi = network.wifi
  const wired = network.wired

  const primaryConnection = createBinding(network, "primary")

  return (
    <box cssClasses={["network-container"]}>
      <With value={primaryConnection}>
        {(conn) =>
          conn === AstalNetwork.Primary.WIFI ? (
            <WiFiSelector wifi={wifi} />
          ) : (
            <WiredStatus wired={wired} />
          )
        }
      </With>
    </box>
  )
}

function WiFiSelector({ wifi }: { wifi: AstalNetwork.Wifi }) {
  const ssid = createBinding(wifi, "ssid")
  const strength = createBinding(wifi, "strength")
  const enabled = createBinding(wifi, "enabled")

  const iconName = strength((str) => {
    if (!enabled.peek()) return "network-wireless-disabled-symbolic"
    if (str >= 80) return "network-wireless-signal-excellent-symbolic"
    if (str >= 60) return "network-wireless-signal-good-symbolic"
    if (str >= 40) return "network-wireless-signal-ok-symbolic"
    if (str >= 20) return "network-wireless-signal-weak-symbolic"
    return "network-wireless-signal-none-symbolic"
  })

  return (
    <menubutton cssClasses={["network-button"]}>
      <box spacing={6}>
        <image iconName={iconName} pixelSize={16} />
        <label label={ssid((s) => s || "No Connection")} />
      </box>
      <popover>
        <WiFiList wifi={wifi} />
      </popover>
    </menubutton>
  )
}

function WiFiList({ wifi }: { wifi: AstalNetwork.Wifi }) {
  const accessPoints = createBinding(wifi, "accessPoints")

  const sortedAPs = accessPoints((aps) => {
    const seen = new Map<string, AstalNetwork.AccessPoint>()

    for (const ap of aps) {
      const existing = seen.get(ap.ssid)
      if (!existing || ap.strength > existing.strength) {
        seen.set(ap.ssid, ap)
      }
    }

    return Array.from(seen.values())
      .filter((ap) => ap.ssid)
      .sort((a, b) => b.strength - a.strength)
  })

  return (
    <box orientation={1} cssClasses={["wifi-list"]} spacing={4}>
      <label label="Available Networks" cssClasses={["wifi-list-header"]} />
      <scrollable maxHeight={400}>
        <box orientation={1} spacing={2}>
          <For each={sortedAPs}>
            {(ap) => <AccessPointItem ap={ap} wifi={wifi} />}
          </For>
        </box>
      </scrollable>
    </box>
  )
}

function AccessPointItem({
  ap,
  wifi,
}: {
  ap: AstalNetwork.AccessPoint
  wifi: AstalNetwork.Wifi
}) {
  const ssid = createBinding(ap, "ssid")
  const strength = createBinding(ap, "strength")
  const active = createBinding(ap, "active")

  const iconName = strength((str) => {
    if (str >= 80) return "network-wireless-signal-excellent-symbolic"
    if (str >= 60) return "network-wireless-signal-good-symbolic"
    if (str >= 40) return "network-wireless-signal-ok-symbolic"
    if (str >= 20) return "network-wireless-signal-weak-symbolic"
    return "network-wireless-signal-none-symbolic"
  })

  return (
    <button
      onClicked={() => {
        wifi.connect_to_access_point(ap)
      }}
      cssClasses={active((a) => (a ? ["wifi-item", "active"] : ["wifi-item"]))}
      focusOnClick={false}
    >
      <box spacing={8}>
        <image iconName={iconName} pixelSize={16} />
        <label label={ssid} hexpand />
        <label
          label={strength((s) => `${s}%`)}
          cssClasses={["wifi-strength"]}
        />
      </box>
    </button>
  )
}

function WiredStatus({ wired }: { wired: AstalNetwork.Wired }) {
  const state = createBinding(wired, "state")
  let imageWidget: any
  let pingMs = -1

  const updatePing = async () => {
    try {
      const { exec } = await import("ags/process")
      const startTime = Date.now()
      exec("ping -c 1 -W 1 8.8.8.8")
      const endTime = Date.now()
      pingMs = endTime - startTime
    } catch (e) {
      pingMs = -2
    }

    if (imageWidget) {
      const status = getStatusText(state.peek())
      imageWidget.set_tooltip_text(`${status} | ${getPingText(pingMs)}`)
      imageWidget.set_from_icon_name(getPingIcon(state.peek(), pingMs))
    }
  }

  const getStatusText = (s: AstalNetwork.DeviceState) => {
    switch (s) {
      case AstalNetwork.DeviceState.ACTIVATED:
        return "Connected"
      case AstalNetwork.DeviceState.DISCONNECTED:
        return "Disconnected"
      case AstalNetwork.DeviceState.PREPARE:
      case AstalNetwork.DeviceState.CONFIG:
      case AstalNetwork.DeviceState.IP_CONFIG:
        return "Connecting..."
      default:
        return "Unknown"
    }
  }

  const getPingText = (ping: number) => {
    if (ping === -1) return "..."
    if (ping === -2) return "offline"
    return `${ping}ms`
  }

  const getPingIcon = (s: AstalNetwork.DeviceState, ping: number) => {
    if (s !== AstalNetwork.DeviceState.ACTIVATED) {
      return "network-wired-disconnected-symbolic"
    }

    if (ping === -2) return "network-cellular-offline-symbolic"
    if (ping === -1) return "network-wired-acquiring-symbolic"
    if (ping < 20) return "network-cellular-signal-excellent-symbolic"
    if (ping < 40) return "network-cellular-signal-good-symbolic"
    if (ping <= 100) return "network-cellular-signal-ok-symbolic"
    if (ping > 100) return "network-cellular-signal-weak-symbolic"
    return "network-cellular-signal-none-symbolic"
  }

  updatePing()
  setInterval(updatePing, 2000)

  const iconName = state((s) => {
    return getPingIcon(s, pingMs)
  })

  const statusText = state((s) => {
    return `${getStatusText(s)} | ${getPingText(pingMs)}`
  })

  return (
    <box cssClasses={["network-status"]}>
      <image
        $={(self) => {
          imageWidget = self
        }}
        iconName={iconName}
        pixelSize={16}
        tooltipText={statusText}
      />
    </box>
  )
}
