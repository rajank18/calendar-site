export function readStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return fallbackValue
    }
    return JSON.parse(raw)
  } catch {
    return fallbackValue
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage write failures (private mode, quota, etc.)
  }
}
