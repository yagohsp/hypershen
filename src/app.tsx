import { createBinding, For, This } from "ags"
import app from "ags/gtk4/app"
import style from "./styles/index.scss"
import Bar from "./modules/bar/Bar"
import VolumeOSD from "./modules/volume/VolumeOSD"

app.start({
  css: style,
  main() {
    const monitors = createBinding(app, "monitors")

    return (
      <For each={monitors}>
        {(monitor) => (
          <This this={app}>
            <Bar gdkmonitor={monitor} />
            <VolumeOSD gdkmonitor={monitor} />
          </This>
        )}
      </For>
    )
  },
})
