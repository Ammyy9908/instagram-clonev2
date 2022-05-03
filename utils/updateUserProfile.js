import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const updateProfile = async (uid, data) => {
  console.log(data);
  const userRef = doc(db, "users", uid);
  let done = await setDoc(userRef, data, { merge: true });
  return done;
};

export default updateProfile;
