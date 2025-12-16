import { Astal, Gdk, Gtk } from "ags/gtk4"
import { createState, With } from "gnim"

export default function Icons() {
  const icons = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
  const [text, setText] = createState("")

  return (
    <menubutton>
      <label label="Icons" />
      <popover>
        <box
          widthRequest={300}
          heightRequest={300}
          orientation={Gtk.Orientation.VERTICAL}
        >
          <entry
            placeholderText="Start typing..."
            text=""
            onNotifyText={({ text }) => setText(text)}
          />
          <scrolledwindow hexpand vexpand>
            <With value={text}>
              {(value) => (
                <Gtk.FlowBox
                  selectionMode={Gtk.SelectionMode.NONE}
                  rowSpacing={6}
                  columnSpacing={6}
                >
                  {icons.iconNames
                    .filter((icon) => icon.includes(value))
                    .map((icon) => (
                      <button
                        onClicked={() => print(icon)}
                        heightRequest={30}
                        widthRequest={30}
                      >
                        <image iconName={icon} pixelSize={24} />
                      </button>
                    ))}
                </Gtk.FlowBox>
              )}
            </With>
          </scrolledwindow>
        </box>
      </popover>
    </menubutton>
  )
}
