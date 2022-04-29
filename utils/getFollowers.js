import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";

const db = getFirestore();
const getFollowers = async (uid) => {
  const q = query(collection(db, "followers"));
  const followers_data = [];

  //   const followings =
  //     followers_data.length > 0 &&
  //     followers_data.filter((follower) => {
  //       return follower.follower_id == uid;
  //     });
  //   console.log(followings);
};

export default getFollowers;
