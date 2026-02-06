import { createBinding, For } from "ags"
import { Gtk } from "ags/gtk4"
import AstalWp from "gi://AstalWp?version=0.1"

const wp = AstalWp.get_default()!

export default function VolumeControl() {
  const audio = wp.audio!
  const speaker = audio.defaultSpeaker!
  const microphone = audio.defaultMicrophone!

  const speakerVolume = createBinding(speaker, "volume")
  const speakerMuted = createBinding(speaker, "mute")
  const micVolume = createBinding(microphone, "volume")
  const micMuted = createBinding(microphone, "mute")

  // Get all audio streams (applications)
  const streams = createBinding(audio, "streams")

  // Icon based on volume and mute state
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
        >
          <box orientation={1} cssClasses={["volume-popup"]} spacing={12}>
            {/* Output Volume */}
            <box orientation={1} spacing={8}>
              <box spacing={8}>
                <label label="Output" cssClasses={["volume-label"]} hexpand />
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
              </box>
              <box spacing={8}>
                <Gtk.Scale
                  hexpand
                  drawValue={false}
                  adjustment={
                    <Gtk.Adjustment
                      lower={0}
                      upper={1}
                      step_increment={0.01}
                      value={speakerVolume.peek()}
                    />
                  }
                  $={(self: Gtk.Scale) => {
                    speakerVolume((v) => {
                      self.adjustment!.set_value(v)
                    })

                    self.adjustment!.connect("value-changed", () => {
                      speaker.set_volume(self.adjustment!.get_value())
                    })
                  }}
                  cssClasses={["volume-slider"]}
                />
                <label
                  label={speakerVolume((v) => `${Math.round(v * 100)}%`)}
                  cssClasses={["volume-percentage"]}
                />
              </box>
            </box>

            {/* Input Volume */}
            <box orientation={1} spacing={8}>
              <box spacing={8}>
                <label label="Input" cssClasses={["volume-label"]} hexpand />
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
              </box>
              <box spacing={8}>
                <Gtk.Scale
                  hexpand
                  drawValue={false}
                  adjustment={
                    <Gtk.Adjustment
                      lower={0}
                      upper={1}
                      step_increment={0.01}
                      value={micVolume.peek()}
                    />
                  }
                  $={(self: Gtk.Scale) => {
                    micVolume((v) => {
                      self.adjustment!.set_value(v)
                    })

                    self.adjustment!.connect("value-changed", () => {
                      microphone.set_volume(self.adjustment!.get_value())
                    })
                  }}
                  cssClasses={["volume-slider"]}
                />
                <label
                  label={micVolume((v) => `${Math.round(v * 100)}%`)}
                  cssClasses={["volume-percentage"]}
                />
              </box>
            </box>

            {/* Separator */}
            <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />

            {/* Application Streams */}
            <box orientation={1} spacing={4}>
              <label
                label="Applications"
                cssClasses={["volume-section-label"]}
              />
              <For each={streams}>
                {(stream) => <StreamControl stream={stream} />}
              </For>
            </box>
          </box>
        </Gtk.ScrolledWindow>
      </popover>
    </menubutton>
  )
}

function StreamControl({ stream }: { stream: AstalWp.Endpoint }) {
  const volume = createBinding(stream, "volume")
  const muted = createBinding(stream, "mute")
  const description = createBinding(stream, "description")

  return (
    <box orientation={1} spacing={6} cssClasses={["stream-control"]}>
      <box spacing={8}>
        <label
          label={description((d) => d || "Unknown")}
          cssClasses={["stream-label"]}
          hexpand
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
      </box>
      <box spacing={8}>
        <Gtk.Scale
          hexpand
          drawValue={false}
          adjustment={
            <Gtk.Adjustment
              lower={0}
              upper={1}
              step_increment={0.01}
              value={volume.peek()}
            />
          }
          $={(self: Gtk.Scale) => {
            volume((v) => {
              self.adjustment!.set_value(v)
            })

            self.adjustment!.connect("value-changed", () => {
              stream.set_volume(self.adjustment!.get_value())
            })
          }}
          cssClasses={["volume-slider"]}
        />
        <label
          label={volume((v) => `${Math.round(v * 100)}%`)}
          cssClasses={["volume-percentage"]}
        />
      </box>
    </box>
  )
}
