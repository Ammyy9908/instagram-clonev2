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
function useSaved(post_id, user_id) {
  const [present, setIndex] = React.useState(-1);
  React.useEffect(() => {
    if (user_id) {
      const q = query(collection(db, "users"), where("uid", "==", user_id));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push(doc.data());
        });

        const present = users[0].saved_posts.includes(post_id);
        setIndex(present);
        console.log("Saved User", users);
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);
  return present;
}

export default useSaved;
