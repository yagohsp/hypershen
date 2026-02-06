import Network from "./Network"

export default function NetworkButton() {
  return (
    <menubutton>
      <label label="Network" />
      <popover>
        <Network />
      </popover>
    </menubutton>
  )
}
