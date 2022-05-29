const requestNotificationPermission = async () => {
  try {
    const granted = await Notification.requestPermission();
    if (granted === "granted") {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
};
export default requestNotificationPermission;
