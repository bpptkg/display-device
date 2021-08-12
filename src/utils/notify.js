export function notificationGranted(message, opts, onclick) {
  const notification = new Notification(message, opts)
  setTimeout(
    () =>
      // Hide the notification after X amount of seconds
      notification.close(),
    8000
  )

  return (notification.onclick = onclick || notification.close)
}

export function notifyPermissions() {
  if ('Notification' in window) {
    return Notification.requestPermission()
  }
}

export function notifyMe(message, body, icon, onclick) {
  const opts = {
    body,
    icon,
  }
  // Let's check if the browser supports notifications
  if (!('Notification' in window)) {
    // do nothing
  } else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    return notificationGranted(message, opts, onclick)
  } else if (Notification.permission !== 'denied') {
    return Notification.requestPermission((permission) => {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        return notificationGranted(message, opts, onclick)
      }
    })
  }
}

const notify = {
  notificationGranted,
  notifyPermissions,
  notifyMe,
}

export default notify
