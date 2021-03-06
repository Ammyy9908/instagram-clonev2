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
function useChats(photo_id) {
  const [chats, setChats] = React.useState([]);
  React.useEffect(() => {
    const q = query(collection(db, "messages"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const cts = [];
      querySnapshot.forEach((doc) => {
        cts.push(doc.data());
      });
      setChats(cts);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return chats;
}

export default useChats;
