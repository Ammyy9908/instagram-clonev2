import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { firebase } from "../firebaseConfig";
const db = getFirestore();
const getPostLikes = async (post_id, user_id) => {
  console.log("Post ID: " + post_id);
  console.log("User ID: " + user_id);
  const q = query(collection(db, "likes"), where("photo_id", "==", post_id));
  const likes = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    likes.push(doc.data());
  });
  console.log(likes);

  const index = likes.findIndex((l) => l.user_id == user_id);
  console.log("Like Index: " + index);

  return { likes, pos: index >= 0 ? true : false };
};

export default getPostLikes;
