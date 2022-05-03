const getMyIp = async () => {
  let ip = await fetch("https://api.ipify.org/?format=json");
  let ipData = await ip.json();
  let ipAddress = ipData.ip;
  return ipAddress;
};

export default getMyIp;
