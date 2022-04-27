import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
const db = getFirestore();
const getUserPost = async (uid) => {
  const q = query(collection(db, "photos"), where("user_id", "==", uid));
  const posts = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    posts.push(doc.data());
  });
  console.log(posts);
  return posts;
};

export default getUserPost;
