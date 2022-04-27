import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebase } from "../firebaseConfig";
const db = getFirestore();
const uploadPost = async (post) => {
  const cityRef = doc(db, "photos", new Date().getTime() + "");
  let saved = await setDoc(cityRef, post, { merge: true });
  return saved;
};

export default uploadPost;
