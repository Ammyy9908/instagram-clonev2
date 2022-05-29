import { firebase } from "../firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const db = getFirestore();
const updateSenderReaction = async (message_id, reaction) => {
  let flag = false;

  const userRef = doc(db, "messages", message_id);
  let done = await setDoc(
    userRef,
    { sender_reaction: reaction },
    { merge: true }
  );
  return done;
};

const updateRecieverReaction = async (message_id, reaction) => {
  let flag = false;

  const userRef = doc(db, "messages", message_id);
  let done = await setDoc(
    userRef,
    { reciever_reaction: reaction },
    { merge: true }
  );
  return done;
};

export { updateSenderReaction, updateRecieverReaction };
