import { createBinding, For, Fragment, With } from "ags"
import AstalWp from "gi://AstalWp?version=0.1"

const wp = AstalWp.get_default()!

export default function AudioOutputButtons() {
  const audio = wp.audio!
  const speakers = createBinding(audio, "speakers")
  const defaultSpeaker = createBinding(audio.defaultSpeaker, "description")

  return (
    <box cssClasses={["audio-output-container"]} spacing={2}>
      <For each={speakers}>
        {(speaker) => {
          const isDefault = defaultSpeaker(
            (desc) => desc === speaker.description,
          )
          const description = createBinding(speaker, "description")

          return (
            <box>
              <With value={isDefault}>
                {(_isDefault) => (
                  <button
                    onClicked={() => {
                      speaker.set_is_default(true)
                    }}
                    focusOnClick={false}
                    tooltipText={description}
                    cssClasses={
                      _isDefault
                        ? ["audio-output-button", "active"]
                        : ["audio-output-button"]
                    }
                  >
                    <image iconName="audio-volume-high-symbolic" />
                  </button>
                )}
              </With>
            </box>
          )
        }}
      </For>
    </box>
  )
}
