import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

// Add a new document in collection "cities"
const db = getFirestore();
const savePost = async (user, post_id) => {
  console.log(user, post_id);
  const saved_posts = user.saved_posts;

  const is_saved = await setDoc(
    doc(db, "users", user.uid),
    {
      saved_posts: [...saved_posts, post_id],
    },
    { merge: true }
  );
  console.log(is_saved);
  if (is_saved) {
    return true;
  }
};

export default savePost;
