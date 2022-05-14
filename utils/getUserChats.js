import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const getUserChats = async (uid, friend_id) => {
  console.log(uid, friend_id);
  const from_chats = query(
    collection(db, "messages"),
    where("from", "==", uid),
    where("to", "==", friend_id)
  );
  const to_chats = query(
    collection(db, "messages"),
    where("from", "==", friend_id),
    where("to", "==", uid)
  );
  const messages = [];
  const querySnapshot1 = await getDocs(from_chats);
  const querySnapshot2 = await getDocs(to_chats);
  querySnapshot1.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    messages.push(doc.data());
  });
  querySnapshot2.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    messages.push(doc.data());
  });

  return messages;
};

export default getUserChats;
