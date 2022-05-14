import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

async function sendPasswordLink(email) {
  console.log(email);
  try {
    const sented = await sendPasswordResetEmail(auth, email);
    return sented;
  } catch (e) {
    return false;
  }
}
export default sendPasswordLink;
