import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const getComment = async (comment_id) => {
  const q = query(
    collection(db, "comments"),
    where("comment_id", "==", comment_id)
  );
  const comments = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    comments.push(doc.data());
  });

  return comments;
};

export default getComment;
