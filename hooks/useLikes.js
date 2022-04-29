import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
const db = getFirestore();
function useLikes(post_id) {
  const [likes, setLikes] = React.useState([]);
  React.useEffect(() => {
    const q = query(collection(db, "likes"), where("photo_id", "==", post_id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lks = [];
      querySnapshot.forEach((doc) => {
        lks.push(doc.data());
      });
      setLikes(lks);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return likes;
}

export default useLikes;
