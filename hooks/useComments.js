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
function useComments(photo_id) {
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const q = query(
      collection(db, "photos_comments"),
      where("photo_id", "==", photo_id)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cmts = [];
      querySnapshot.forEach((doc) => {
        cmts.push(doc.data());
      });
      setComments(cmts);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return comments;
}

export default useComments;
