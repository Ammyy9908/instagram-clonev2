import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const switchProfile = async (uid, account_type) => {
  const userRef = doc(db, "users", uid);
  try {
    await setDoc(userRef, { account_type }, { merge: true });
    return true;
  } catch {
    return false;
  }
};

export default switchProfile;
