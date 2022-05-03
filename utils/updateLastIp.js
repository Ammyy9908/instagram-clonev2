import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const updateLastIp = async (uid, ip) => {
  let flag = false;

  const userRef = doc(db, "users", uid);
  let done = await setDoc(userRef, { last_ip: ip }, { merge: true });
  return done;
};

export default updateLastIp;
