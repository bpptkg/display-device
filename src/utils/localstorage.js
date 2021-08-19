export const isLocalStorageAvailable = () => {
  const mod = 'display-device'
  try {
    localStorage.setItem(mod, mod)
    localStorage.removeItem(mod)
    return true
  } catch (e) {
    return false
  }
}
