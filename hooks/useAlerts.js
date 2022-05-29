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
function useAlerts(uid) {
  const [alerts, setAlerts] = React.useState([]);
  React.useEffect(() => {
    const q = query(
      collection(db, "alerts"),
      where("generated_for", "==", uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ats = [];
      querySnapshot.forEach((doc) => {
        ats.push(doc.data());
      });
      setAlerts(ats);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return alerts;
}

export default useAlerts;
