import Bluetooth from "./Bluetooth"

export default function BluetoothButton() {
  return (
    <menubutton>
      <label label="Bluetooth" />
      <popover>
        <Bluetooth />
      </popover>
    </menubutton>
  )
}
