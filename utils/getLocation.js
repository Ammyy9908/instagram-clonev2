import axios from "axios";

const getLocation = async (lat, long) => {
  try {
    const r = await axios.get(
      `https://api.dominos.co.in/locator-service/ve2/geocode?latitude=${lat}&longitude=${long}`
    );
    return r.data;
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(e.response.data);
    }
  }
};

export default getLocation;
