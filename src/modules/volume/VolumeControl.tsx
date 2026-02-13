import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"
import AstalWp from "gi://AstalWp?version=0.1"
import Pango from "gi://Pango"

const wp = AstalWp.get_default()!

export default function VolumeControl() {
  const audio = wp.audio!
  const speaker = audio.defaultSpeaker!
  const microphone = audio.defaultMicrophone!

  const speakerVolume = createBinding(speaker, "volume")
  const speakerMuted = createBinding(speaker, "mute")
  const speakerDescription = createBinding(speaker, "description")
  const micVolume = createBinding(microphone, "volume")
  const micMuted = createBinding(microphone, "mute")
  const micDescription = createBinding(microphone, "description")

  const streams = createBinding(audio, "streams")
  const speakers = createBinding(audio, "speakers")

  const speakerIcon = speakerVolume((vol) => {
    if (speakerMuted.peek()) return "audio-volume-muted-symbolic"
    if (vol === 0) return "audio-volume-muted-symbolic"
    if (vol < 0.33) return "audio-volume-low-symbolic"
    if (vol < 0.67) return "audio-volume-medium-symbolic"
    return "audio-volume-high-symbolic"
  })

  return (
    <menubutton cssClasses={["volume-control"]}>
      <box spacing={6}>
        <image iconName={speakerIcon} pixelSize={16} />
      </box>
      <popover>
        <Gtk.ScrolledWindow
          cssClasses={["volume-container"]}
          maxContentHeight={500}
          propagateNaturalHeight
          hscrollbarPolicy={Gtk.PolicyType.NEVER}
          minContentWidth={340}
          maxContentWidth={340}
        >
          <box orientation={1} cssClasses={["volume-popup"]} spacing={12}>
            <box orientation={1} spacing={4}>
              <label
                label="Output Devices"
                cssClasses={["volume-section-title"]}
                halign={Gtk.Align.START}
              />
              <For each={speakers}>
                {(speakerDevice) => <OutputDeviceRow speaker={speakerDevice} />}
              </For>
            </box>

            <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />

            <box orientation={1} spacing={6}>
              <label
                label={speakerDescription((d) => d || "Output")}
                cssClasses={["volume-slider-label"]}
                halign={Gtk.Align.START}
                ellipsize={Pango.EllipsizeMode.END}
                maxWidthChars={35}
              />
              <box spacing={8} cssClasses={["volume-slider-row"]}>
                <slider
                  onChangeValue={(self) => {
                    speaker.volume = self.value
                  }}
                  value={speakerVolume}
                  min={0}
                  max={1}
                  step={0.01}
                  hexpand
                  cssClasses={["volume-slider"]}
                />
                <button
                  onClicked={() => speaker.set_mute(!speakerMuted.peek())}
                  cssClasses={["volume-mute-button"]}
                  focusOnClick={false}
                >
                  <image
                    iconName={speakerMuted((m) =>
                      m
                        ? "audio-volume-muted-symbolic"
                        : "audio-volume-high-symbolic",
                    )}
                    pixelSize={16}
                  />
                </button>
                <label
                  label={speakerVolume((v) => `${Math.round(v * 100)}%`)}
                  cssClasses={["volume-percentage"]}
                />
              </box>
            </box>

            <box orientation={1} spacing={6}>
              <label
                label={micDescription((d) => d || "Input")}
                cssClasses={["volume-slider-label"]}
                halign={Gtk.Align.START}
                ellipsize={Pango.EllipsizeMode.END}
                maxWidthChars={35}
              />
              <box spacing={8} cssClasses={["volume-slider-row"]}>
                <slider
                  onChangeValue={(self) => {
                    microphone.volume = self.value
                  }}
                  value={micVolume}
                  min={0}
                  max={1}
                  step={0.01}
                  hexpand
                  cssClasses={["volume-slider"]}
                />
                <button
                  onClicked={() => microphone.set_mute(!micMuted.peek())}
                  cssClasses={["volume-mute-button"]}
                  focusOnClick={false}
                >
                  <image
                    iconName={micMuted((m) =>
                      m
                        ? "microphone-sensitivity-muted-symbolic"
                        : "microphone-sensitivity-high-symbolic",
                    )}
                    pixelSize={16}
                  />
                </button>
                <label
                  label={micVolume((v) => `${Math.round(v * 100)}%`)}
                  cssClasses={["volume-percentage"]}
                />
              </box>
            </box>

            <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />

            <box orientation={1} spacing={8}>
              <label
                label="Applications"
                cssClasses={["volume-section-title"]}
                halign={Gtk.Align.START}
              />
              <For each={streams}>
                {(stream) => <StreamControl key={stream.get_id()} stream={stream} />}
              </For>
            </box>
          </box>
        </Gtk.ScrolledWindow>
      </popover>
    </menubutton>
  )
}

function OutputDeviceRow({ speaker }: { speaker: AstalWp.Endpoint }) {
  const description = createBinding(speaker, "description")
  const isDefault = createBinding(speaker, "isDefault")

  return (
    <button
      onClicked={() => speaker.set_is_default(true)}
      cssClasses={isDefault((d) =>
        d ? ["output-device-row", "active"] : ["output-device-row"],
      )}
      focusOnClick={false}
    >
      <box spacing={8}>
        <image
          iconName={isDefault((d) =>
            d ? "object-select-symbolic" : "audio-speakers-symbolic",
          )}
          pixelSize={16}
        />
        <label 
          label={description} 
          hexpand 
          halign={Gtk.Align.START}
          ellipsize={Pango.EllipsizeMode.END}
        />
      </box>
    </button>
  )
}

function StreamControl({ stream }: { stream: AstalWp.Stream }) {
  const volume = createBinding(stream, "volume")
  const muted = createBinding(stream, "mute")
  const description = createBinding(stream, "description")

  return (
    <box orientation={1} spacing={6} cssClasses={["stream-control"]}>
      <label
        label={description((d) => d || "Unknown")}
        cssClasses={["volume-slider-label"]}
        halign={Gtk.Align.START}
        ellipsize={Pango.EllipsizeMode.END}
        maxWidthChars={35}
      />
      <box spacing={8} cssClasses={["volume-slider-row"]}>
        <slider
          onChangeValue={(self) => {
            stream.volume = self.value
          }}
          value={volume}
          min={0}
          max={1}
          step={0.01}
          hexpand
          cssClasses={["volume-slider"]}
        />

        <button
          onClicked={() => stream.set_mute(!muted.peek())}
          cssClasses={["volume-mute-button"]}
          focusOnClick={false}
        >
          <image
            iconName={muted((m) =>
              m ? "audio-volume-muted-symbolic" : "audio-volume-high-symbolic",
            )}
            pixelSize={14}
          />
        </button>

        <label
          label={volume((v) => `${Math.round(v * 100)}%`)}
          cssClasses={["volume-percentage"]}
        />
      </box>
    </box>
  )
}
