import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const setAlert = async (alert) => {
  console.log(alert);
  const alertRef = doc(db, "alerts", new Date().getTime() + "");
  let saved = await setDoc(alertRef, alert, { merge: true });
  return saved;
};

export default setAlert;
