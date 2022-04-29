import { firebase } from "../firebaseConfig";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
const db = getFirestore();
function useLikes(post_id, user_id) {
  const [likes, setLikes] = React.useState([]);
  const [index, setIndex] = React.useState(-1);
  React.useEffect(() => {
    const q = query(collection(db, "likes"), where("photo_id", "==", post_id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lks = [];
      querySnapshot.forEach((doc) => {
        lks.push(doc.data());
      });
      setLikes(lks);
      const index = lks.findIndex((l) => l.user_id == user_id);
      setIndex(index >= 0 ? index : -1);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { likes, index };
}

export default useLikes;
