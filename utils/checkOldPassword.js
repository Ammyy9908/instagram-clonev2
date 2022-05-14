import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { firebase } from "../firebaseConfig";
const auth = getAuth();
async function checkOldPassword(email, oldPassword) {
  try {
    let user = await signInWithEmailAndPassword(auth, email, oldPassword);
    return user;
  } catch (e) {
    return false;
  }
}

export default checkOldPassword;
