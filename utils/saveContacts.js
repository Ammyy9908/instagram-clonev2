import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const saveContacts = async (uid, contacts) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, { contacts: contacts }, { merge: true });
    return true;
  } catch (e) {
    return false;
  }
};

export default saveContacts;
