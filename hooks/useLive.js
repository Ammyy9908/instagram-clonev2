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
function useLive(person_id) {
  const [activities, setActivities] = React.useState([]);
  React.useEffect(() => {
    const q = query(
      collection(db, "onlineactivities"),
      where("id", "==", person_id)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const act = [];
      querySnapshot.forEach((doc) => {
        act.push(doc.data());
      });
      setActivities(act);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return activities;
}

export default useLive;
