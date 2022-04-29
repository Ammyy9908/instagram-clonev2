import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"
const db = getFirestore();
const LikePost = async (user, post_id) => {
  console.log(user, post_id);

  const is_saved = await setDoc(doc(db, "likes", new Date().getTime() + ""), {
    date_created: new Date().getTime(),
    photo_id: post_id,
    user_id: user.uid,
  });
  console.log(is_saved);
  if (is_saved) {
    return true;
  }
};

export default LikePost;
