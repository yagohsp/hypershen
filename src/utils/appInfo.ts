import AstalApps from "gi://AstalApps"

function findAppInList(
  appId: string,
  appList: AstalApps.Application[],
): AstalApps.Application | null {
  const searchTerm = appId.toLowerCase()

  for (const app of appList) {
    if (
      app.entry?.toLowerCase() === searchTerm ||
      app.iconName === appId ||
      app.name === appId ||
      app.wm_class === appId
      // || app.iconName === config.bar.modules.workspaces["taskbar-icons"][appId]
    ) {
      return app
    }
  }

  for (const app of appList) {
    if (app.entry?.toLowerCase().includes(searchTerm)) {
      return app
    }
  }

  return null
}

const appInfoCache = new Map<string, AstalApps.Application | null>()
const MAX_CACHE_SIZE = 50
function addToCache(key: string, value: AstalApps.Application | null): void {
  if (appInfoCache.size >= MAX_CACHE_SIZE) {
    const firstKey = appInfoCache.keys().next().value
    if (firstKey) appInfoCache.delete(firstKey)
  }
  appInfoCache.set(key, value)
}

let appManager: AstalApps.Apps | null = null
function getAppManager(): AstalApps.Apps {
  if (!appManager) {
    appManager = new AstalApps.Apps()
  }
  return appManager
}

export function getAppInfo(appId: string): AstalApps.Application | null {
  if (!appId) return null

  if (appInfoCache.has(appId)) {
    return appInfoCache.get(appId)!
  }

  const manager = getAppManager()
  const appList = manager.get_list()

  const match = findAppInList(appId, appList)

  addToCache(appId, match)
  return match
}
