import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const removeContacts = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { contacts: [] }, { merge: true });
    return true;
  } catch (e) {
    return false;
  }
};

export default removeContacts;
