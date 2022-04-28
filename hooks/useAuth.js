import { getAuth, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { firebase } from "../firebaseConfig";
function useAuth() {
  const [user, setUser] = React.useState(null);
  const auth = getAuth();
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        setUser(user);
        // ...
      }
    });
  }, [auth]);
  return user;
}

export default useAuth;
