import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"
const db = getFirestore();
const addComment = async (comment, user_id, photo_id) => {
  console.log(
    "User " + user_id + " added comment " + comment + " to photo " + photo_id
  );
  let comment_id = new Date().getTime() + "";
  const comment_saved = await setDoc(
    doc(db, "comments", comment_id),
    {
      comment: comment,
      comment_id,
    },
    { merge: true }
  );
  const photo_comment_saved = await setDoc(
    doc(db, "photos_comments", new Date().getTime() + ""),
    {
      comment_id,
      user_id,
      photo_id,
    },
    {
      merge: true,
    }
  );
  return true;
};

export default addComment;
