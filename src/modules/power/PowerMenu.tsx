import { exec } from "ags/process"

export default function PowerMenu() {
  const handleSuspend = () => {
    exec("systemctl suspend")
  }

  const handleUpdate = () => {
    exec(`kitty --title "System Update" bash -c '
      echo "========================================";
      echo "  System Update (yay -Syu)";
      echo "========================================";
      echo "";
      yay -Syu --noconfirm;
      echo "";
      echo "========================================";
      echo "  Update Complete!";
      echo "========================================";
      echo "";
      echo "Press any key to close...";
      read -n 1
    '`)
  }

  const handleShutdown = () => {
    exec("systemctl poweroff")
  }

  const handleUpdateAndShutdown = () => {
    exec(`kitty --title "Update & Shutdown" bash -c '
      echo "========================================";
      echo "  System Update (yay -Syu)";
      echo "  Will shutdown after completion";
      echo "========================================";
      echo "";
      yay -Syu --noconfirm;
      echo "";
      echo "========================================";
      echo "  Update Complete!";
      echo "  Shutting down in 3 seconds...";
      echo "========================================";
      echo "";
      sleep 3;
      systemctl poweroff
    '`)
  }

  return (
    <menubutton cssClasses={["power-menu"]}>
      <image iconName="system-shutdown-symbolic" pixelSize={16} />
      <popover>
        <box orientation={1} cssClasses={["power-menu-popup"]} spacing={4}>
          <button
            onClicked={handleSuspend}
            cssClasses={["power-menu-item"]}
            focusOnClick={false}
          >
            <box spacing={8}>
              <image iconName="system-suspend-symbolic" pixelSize={16} />
              <label label="Suspend" />
            </box>
          </button>

          <button
            onClicked={handleUpdate}
            cssClasses={["power-menu-item"]}
            focusOnClick={false}
          >
            <box spacing={8}>
              <image iconName="system-software-update-symbolic" pixelSize={16} />
              <label label="Update System" />
            </box>
          </button>

          <button
            onClicked={handleShutdown}
            cssClasses={["power-menu-item"]}
            focusOnClick={false}
          >
            <box spacing={8}>
              <image iconName="system-shutdown-symbolic" pixelSize={16} />
              <label label="Shutdown" />
            </box>
          </button>

          <button
            onClicked={handleUpdateAndShutdown}
            cssClasses={["power-menu-item"]}
            focusOnClick={false}
          >
            <box spacing={8}>
              <image iconName="system-software-install-symbolic" pixelSize={16} />
              <label label="Update & Shutdown" />
            </box>
          </button>
        </box>
      </popover>
    </menubutton>
  )
}
