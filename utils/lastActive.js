import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const LastActive = async (person_id) => {
  console.log("Person ID: ", person_id);
  const q = query(
    collection(db, "onlineactivities"),
    where("id", "==", person_id)
  );
  const activities = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    activities.push(doc.data());
  });

  return activities;
};

export default LastActive;
