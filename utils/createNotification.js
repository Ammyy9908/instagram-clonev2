const createNotification = (title, options) => {
  if (!("Notification" in window)) {
    return;
  }
  if (Notification.permission === "granted") {
    const notification = new Notification(title, options);
    notification.onclick = () => {
      window.focus();
    };
    return notification;
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission((permission) => {
      if (permission === "granted") {
        const notification = new Notification(title, options);
        notification.onclick = () => {
          window.focus();
        };
        return notification;
      }
    });
  }
};

export default createNotification;
