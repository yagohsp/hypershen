import { createBinding, createComputed } from "ags"
import AstalBattery from "gi://AstalBattery?version=0.1"
import AstalNetwork from "gi://AstalNetwork"
import AstalWp from "gi://AstalWp?version=0.1"

export const icons = {
  search: "system-search-symbolic",
  settings: "emblem-system-symbolic",
  clipboard: "edit-paste-symbolic",
  keyboard: "input-keyboard-symbolic",
  memory: "drive-harddisk-symbolic",
  cpu: "computer-symbolic",
  arrow: {
    left: "go-previous-symbolic",
    right: "go-next-symbolic",
    down: "go-down-symbolic",
    up: "go-up-symbolic",
  },
  trash: "user-trash-symbolic",
  player: {
    icon: "folder-music-symbolic",
    play: "media-playback-start-symbolic",
    pause: "media-playback-pause-symbolic",
    prev: "media-skip-backward-symbolic",
    next: "media-skip-forward-symbolic",
  },
  refresh: "view-refresh-symbolic",
  check: "object-select-symbolic",
  powerprofiles: {
    "power-saver": "power-profile-power-saver-symbolic",
    balanced: "power-profile-balanced-symbolic",
    performance: "power-profile-performance-symbolic",
  } as Record<string, any>,
  network: {
    wifi: {
      disabled: "network-wireless-disabled-symbolic",
      1: "network-wireless-signal-weak-symbolic",
      2: "network-wireless-signal-ok-symbolic",
      3: "network-wireless-signal-good-symbolic",
      4: "network-wireless-signal-excellent-symbolic",
    },
    wired: "network-wired-symbolic",
  },
  bluetooth: "bluetooth-symbolic",
  bell: "notification-symbolic",
  bell_off: "notification-disabled-symbolic",
  microphone: {
    default: "audio-input-microphone-symbolic",
    muted: "microphone-sensitivity-muted-symbolic",
  },
  powermenu: {
    sleep: "weather-clear-night-symbolic",
    reboot: "system-reboot-symbolic",
    logout: "system-log-out-symbolic",
    shutdown: "system-shutdown-symbolic",
  } as Record<string, any>,
  volume: {
    muted: "audio-volume-muted-symbolic",
    low: "audio-volume-low-symbolic",
    medium: "audio-volume-medium-symbolic",
    high: "audio-volume-high-symbolic",
  },
  battery: {
    charging: "battery-level-100-charging-symbolic",
    1: "battery-level-100-symbolic",
    2: "battery-level-70-symbolic",
    3: "battery-level-50-symbolic",
    4: "battery-level-20-symbolic",
  },
  brightness: "display-brightness-symbolic",
  video: "camera-video-symbolic",
  close: "window-close-symbolic",
  apps_default: "application-x-executable",
  droplet: "weather-showers-symbolic",
  clock: "preferences-system-time-symbolic",
  calendar: "x-office-calendar-symbolic",
  location: "mark-location-symbolic",
  weather: {
    clear: {
      day: "weather-clear-symbolic",
      night: "weather-clear-night-symbolic",
    },
    cloudy: {
      day: "weather-few-clouds-symbolic",
      night: "weather-few-clouds-night-symbolic",
    },
    fog: "weather-fog-symbolic",
    rain: {
      day: "weather-showers-scattered-symbolic",
      night: "weather-showers-scattered-symbolic",
      general: "weather-showers-symbolic",
    },
    snow: "weather-snow-symbolic",
    shower_rain: "weather-showers-symbolic",
    thunder: "weather-storm-symbolic",
  },
}

export function getVolumeIcon(speaker?: AstalWp.Endpoint) {
  let volume = speaker?.volume
  let muted = speaker?.mute
  let speakerIcon = speaker?.icon
  if (volume == null || speakerIcon == null) return ""

  if (volume === 0 || muted) {
    return icons.volume.muted
  } else if (volume < 0.33) {
    return icons.volume.low
  } else if (volume < 0.66) {
    return icons.volume.medium
  } else {
    return icons.volume.high
  }
}

const wp = AstalWp.get_default()
const speaker = wp?.audio.defaultSpeaker!
const speakerVar = createComputed([
  createBinding(speaker, "description"),
  createBinding(speaker, "volume"),
  createBinding(speaker, "mute"),
])
export const VolumeIcon = speakerVar(() => getVolumeIcon(speaker))

export function getBatteryIcon(battery: AstalBattery.Device) {
  const percent = battery.percentage
  if (battery.state === AstalBattery.State.CHARGING) {
    return icons.battery.charging
  } else {
    if (percent <= 0.25) {
      return icons.battery[4]
    } else if (percent <= 0.5) {
      return icons.battery[3]
    } else if (percent <= 0.75) {
      return icons.battery[2]
    } else {
      return icons.battery[1]
    }
  }
}

const battery = AstalBattery.get_default()
const batteryVar = createComputed([
  createBinding(battery, "percentage"),
  createBinding(battery, "state"),
])
export const BatteryIcon = batteryVar(() => getBatteryIcon(battery))

export function getNetworkIcon(network: AstalNetwork.Network) {
  const { connectivity, wifi, wired } = network

  if (network.primary === AstalNetwork.Primary.WIRED) {
    if (wired.internet === AstalNetwork.Internet.CONNECTED) {
      return icons.network.wired
    }
  }

  if (network.primary === AstalNetwork.Primary.WIFI) {
    const { strength, internet, enabled } = wifi

    if (!enabled || connectivity === AstalNetwork.Connectivity.NONE) {
      return icons.network.wifi[1]
    }

    if (strength < 26) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return icons.network.wifi[4]
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return icons.network.wifi[4]
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return icons.network.wifi[4]
      }
    } else if (strength < 51) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return icons.network.wifi[3]
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return icons.network.wifi[3]
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return icons.network.wifi[3]
      }
    } else if (strength < 76) {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return icons.network.wifi[2]
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return icons.network.wifi[2]
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return icons.network.wifi[2]
      }
    } else {
      if (internet === AstalNetwork.Internet.DISCONNECTED) {
        return icons.network.wifi[1]
      } else if (internet === AstalNetwork.Internet.CONNECTED) {
        return icons.network.wifi[1]
      } else if (internet === AstalNetwork.Internet.CONNECTING) {
        return icons.network.wifi[1]
      }
    }

    return icons.network.wifi[1]
  }

  return icons.network.wifi[1]
}

export function getNetworkIconBinding() {
  const network = AstalNetwork.get_default()

  return createComputed([
    createBinding(network, "connectivity"),
    ...(network.wifi !== null ? [createBinding(network.wifi, "strength")] : []),
    createBinding(network, "primary"),
  ])(() => getNetworkIcon(network))
}

export function getAccessPointIcon(accessPoint: AstalNetwork.AccessPoint) {
  const strength = accessPoint.strength

  if (strength <= 25) {
    return icons.network.wifi[4]
  } else if (strength <= 50) {
    return icons.network.wifi[3]
  } else if (strength <= 75) {
    return icons.network.wifi[2]
  } else {
    return icons.network.wifi[1]
  }
}

export function getWeatherIcon(weatherCode: number, is_day?: boolean) {
  const rain_icon =
    is_day === undefined
      ? icons.weather.rain.day
      : is_day
        ? icons.weather.rain.day
        : icons.weather.rain.night

  const clear_icon =
    is_day === undefined
      ? icons.weather.clear.day
      : is_day
        ? icons.weather.clear.day
        : icons.weather.clear.night
  const cloudy_icon =
    is_day === undefined
      ? icons.weather.cloudy.day
      : is_day
        ? icons.weather.cloudy.day
        : icons.weather.cloudy.night

  const weather_icons = {
    0: clear_icon,
    1: clear_icon,
    2: cloudy_icon,
    3: cloudy_icon,
    45: icons.weather.fog,
    48: icons.weather.fog,
    51: rain_icon,
    53: rain_icon,
    55: rain_icon,
    56: rain_icon,
    57: rain_icon,
    61: rain_icon,
    63: rain_icon,
    65: rain_icon,
    66: rain_icon,
    67: rain_icon,
    71: rain_icon,
    73: icons.weather.snow,
    75: icons.weather.snow,
    77: icons.weather.snow,
    80: icons.weather.shower_rain,
    81: icons.weather.shower_rain,
    82: icons.weather.shower_rain,
    85: icons.weather.snow,
    86: icons.weather.snow,
    95: icons.weather.thunder,
    96: icons.weather.thunder,
    99: icons.weather.thunder,
  } as Record<number, any>

  return weather_icons[weatherCode]
}
