import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const updateStatus = async (uid, status) => {
  let flag = false;

  const userRef = doc(db, "users", uid);
  let done = await setDoc(userRef, { status: status }, { merge: true });
  return done;
};

export default updateStatus;
