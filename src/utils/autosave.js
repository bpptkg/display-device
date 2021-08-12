export const clearDraft = (autosaveKey) => {
  try {
    window.localStorage.removeItem(`autosave/${autosaveKey}`)
  } catch (e) {
    console.error(e)
  }
}

export const getDraft = (autosaveKey) => {
  try {
    return window.localStorage.getItem(`autosave/${autosaveKey}`)
  } catch (e) {
    console.log(e)
  }
}

export const updateDraft = (autosaveKey) => {
  try {
    window.localStorage.setItem(`autosave/${autosaveKey}`)
  } catch (e) {
    console.log(e)
  }
}
