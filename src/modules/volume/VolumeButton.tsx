import Volume from "./Volume"

export default function VolumeButton() {
  return (
    <menubutton>
      <label label="Volume" />
      <popover>
        <Volume />
      </popover>
    </menubutton>
  )
}
