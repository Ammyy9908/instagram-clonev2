import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const disableAccount = async (uid, disabled) => {
  const userRef = doc(db, "users", uid);
  try {
    await setDoc(userRef, { is_disabled: disabled }, { merge: true });
    return true;
  } catch {
    return false;
  }
};

export default disableAccount;
