import axios from "axios";

/**
 * 
 * 
 * GET https://people.googleapis.com/v1/people/me/connections?pageSize=150&personFields=phoneNumbers%2Cnames%2CemailAddresses&key=[YOUR_API_KEY] HTTP/1.1

Authorization: Bearer [YOUR_ACCESS_TOKEN]
Accept: application/json

 */

let API_KEY = "AIzaSyAoyUU7vq13v_f0-VW1-ENh_CLk7AV6qZU";

const loadContacts = async (accessToken) => {
  try {
    const r = await axios.get(
      `https://people.googleapis.com/v1/people/me/connections?pageSize=150&personFields=phoneNumbers%2Cnames%2CemailAddresses&key=${API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return r.data;
  } catch (e) {
    if (e.response && e.response.data) {
      return e.response.data;
    }
  }
};

export default loadContacts;
