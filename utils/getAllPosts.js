import {
  collection,
  query,
  where,
  getDocs,
  getFirestore,
} from "firebase/firestore";
const db = getFirestore();
const getAllPosts = async () => {
  const q = query(collection(db, "photos"));
  const posts = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    posts.push({ data: doc.data(), id: doc.id });
  });
  console.log(posts);
  return posts.reverse();
};

export default getAllPosts;
