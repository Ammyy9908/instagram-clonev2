import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const getMyChats = async (uid) => {
  const from_chats = query(collection(db, "messages"), where("to", "==", uid));

  const messages = [];
  const querySnapshot1 = await getDocs(from_chats);
  querySnapshot1.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    messages.push(doc.data());
  });

  return messages.filter(
    (v, i, a) => a.findIndex((v2) => v2.from === v.from) === i
  );
};

export default getMyChats;
