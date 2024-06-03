export const getStorage = <T extends object>(key: string) => {
  try {
    const obj = JSON.parse(localStorage.getItem(key)!)
    return (obj || {}) as T
  } catch (error) {
    return {} as T
  }
}

export const setStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const removeStorage = (key: string) => {
  localStorage.removeItem(key)
}
