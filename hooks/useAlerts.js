import { firebase } from "../firebaseConfig";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import createNotification from "../utils/createNotification";
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

      createNotification("This is a test", {
        body: "This is a test",
        icon: "https://cdn.iconscout.com/public/images/icon/free/png-512/avatar-user-circle-1-569785.png",
        tag: "test",
      });
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
