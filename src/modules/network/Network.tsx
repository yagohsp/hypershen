import AstalNetwork from "gi://AstalNetwork"
import { Gtk } from "ags/gtk4"
import { createBinding, createComputed, For } from "ags"
import { getAccessPointIcon, icons } from "../../utils/icons"
const network = AstalNetwork.get_default()

function ScanningIndicator() {
  const className = createBinding(network.wifi, "scanning").as((scanning) => {
    const classes = ["scanning"]
    if (scanning) classes.push("active")
    return classes
  })

  return (
    <image iconName={icons.refresh} pixelSize={24} cssClasses={className} />
  )
}

function Header({ showArrow = false }: { showArrow?: boolean }) {
  return (
    <box spacing={4}>
      {showArrow && (
        <button
          focusOnClick={false}
          // onClicked={() => qs_page_set("main")}
        >
          <label label="imagem" />
          <image iconName={icons.arrow.left} pixelSize={4} />
        </button>
      )}
      <label
        label={"Wi-Fi"}
        halign={Gtk.Align.START}
        valign={Gtk.Align.CENTER}
      />
      <box hexpand />
      <button focusOnClick={false} onClicked={() => network.wifi.scan()}>
        <ScanningIndicator />
      </button>
      {/* <switch */}
      {/*   class={"toggle"} */}
      {/*   valign={Gtk.Align.CENTER} */}
      {/*   active={createBinding(network.wifi, "enabled")} */}
      {/*   onNotifyActive={({ state }) => network.wifi.set_enabled(state)} */}
      {/* /> */}
    </box>
  )
}

type ItemProps = {
  accessPoint: AstalNetwork.AccessPoint
}

function Item({ accessPoint }: ItemProps) {
  const connected = createBinding(network.wifi, "ssid").as(
    (ssid) => ssid === accessPoint.ssid,
  )

  return (
    <button
      onClicked={() => {
        console.log(`Network: connecting to '${accessPoint.ssid}'`)
        // bash(`nmcli device wifi connect ${accessPoint.bssid}`)
        //   .then(() =>
        //     console.log(`Network: connected to '${accessPoint.ssid}'`),
        //   )
        //   .catch((err) =>
        //     console.error(
        //       `Network: failed to connect to '${accessPoint.ssid}':`,
        //       err,
        //     ),
        //   )
      }}
      focusOnClick={false}
    >
      <box spacing={4}>
        <image iconName={getAccessPointIcon(accessPoint)} pixelSize={24} />
        <label label={accessPoint.ssid} />
        <box hexpand />
        <image iconName={icons.check} pixelSize={24} visible={connected} />
      </box>
    </button>
  )
}

function List() {
  const ssid = createBinding(network.wifi, "ssid")
  const accessPoints = createBinding(network.wifi, "accessPoints")
  const list = createComputed(() => {
    return accessPoints()
      .filter((ap) => !!ap.ssid)
      .sort((a, b) => b.strength - a.strength)
      .sort((a, b) => Number(ssid() === b.ssid) - Number(ssid() === a.ssid))
  })

  return (
    <scrolledwindow>
      <box orientation={Gtk.Orientation.VERTICAL} spacing={4} vexpand>
        <For each={list}>{(ap) => <Item accessPoint={ap} />}</For>
      </box>
    </scrolledwindow>
  )
}

export default function Network({
  showArrow = false,
}: {
  showArrow?: boolean
}) {
  console.log("Network: initializing module")
  if (!network.wifi) return <label label="null" />

  return (
    <box
      heightRequest={500 - 4 * 2}
      widthRequest={410 - 4 * 2}
      orientation={Gtk.Orientation.VERTICAL}
      spacing={4}
    >
      <Header showArrow={showArrow} />
      <List />
    </box>
  )
}
