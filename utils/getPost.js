import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebase } from "../firebaseConfig";
const db = getFirestore();
const getPost = async (post_id) => {
  const docRef = doc(db, "photos", post_id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return false;
  }
};

export default getPost;
