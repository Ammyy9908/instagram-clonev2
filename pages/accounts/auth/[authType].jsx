import { useRouter } from "next/router";
import React from "react";
import styles from "./Auth.module.css";
import { firebase, db } from "../../../firebaseConfig";
import SnackBar from "../../../components/SnackBar/SnackBar";
import { doc, getFirestore, setDoc } from "firebase/firestore";
//eslint-disable-next-line

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import Link from "next/link";
const auth = getAuth();
const database = getFirestore();

function FormControl({ placeholder, type, value, setValue }) {
  return (
    <div className={styles.form_control}>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}

function Auth() {
  const router = useRouter();
  const { authType } = router.query;
  const [email, setEmail] = React.useState("");
  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [changed, setChange] = React.useState(false);

  // empty fields when route changes

  React.useEffect(() => {
    setEmail("");
    setName("");
    setUsername("");
    setPassword("");
    setError(false);
    setSaved(false);
    setChange(false);
  }, [router.query]);

  const handleCreate = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        createNewUserData(user);
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("Error while Creating ", error);
        if (errorCode === "auth/email-already-in-use") {
          setError({ message: "Email already in use" });
          setEmail("");
          setPassword("");
          setName("");
          setUsername("");
        }
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ..
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        router.push("/");
      })
      .catch((e) => {
        console.log(e.message);
        if (e.message === "Firebase: Error (auth/user-not-found).") {
          setSaved({
            message: "No user found with this email",
          });
          return;
        }
        setSaved({
          message: "Email or password is incorrect",
        });
      });
  };
  async function createNewUserData(user) {
    console.log("User after Creating", user);
    const collectionRef = doc(database, "users", user.uid);
    let ip = await fetch("https://api.ipify.org/?format=json");
    let ipData = await ip.json();
    let ipAddress = ipData.ip;
    setDoc(collectionRef, {
      saved_posts: [],
      avatar: `https://avatars.dicebear.com/api/micah/${name}.svg`,
      uid: user.uid,
      email: user.email,
      username: username,
      name: name,
      last_ip: ipAddress,
      created_at: new Date(),
      updated_at: new Date(),
      status: "online",
      contacts: [],
      account_type: "personal",
    })
      .then(function (docRef) {
        console.log(docRef);
        router.push("/");
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }
  return (
    <div className={styles.auth_container}>
      <div>
        <div className={styles.auth_box}>
          <div className={styles.auth_box_content}>
            <h3>
              <img src="/assets/insta_logo.png" alt="" />
            </h3>
            <p className="text-gray-500 font-bold">
              Sign up to see photos and videos from your friends.
            </p>
            <form
              className="mt-5"
              onSubmit={authType === "login" ? handleLogin : handleCreate}
            >
              <FormControl
                type="email"
                placeholder="Email address"
                value={email}
                setValue={setEmail}
              />
              {authType === "create" && (
                <>
                  <FormControl
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    setValue={setName}
                  />
                  <FormControl
                    type="text"
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                  />
                </>
              )}
              <FormControl
                type="password"
                placeholder="Password"
                value={password}
                setValue={setPassword}
              />
              <input
                type="submit"
                value={authType === "create" ? "Sign Up" : "Log In"}
                className="flex items-center justify-center text-white bg-sky-200 px-5 w-full py-2 cursor-pointer mb-5"
              />
            </form>
            {error && (
              <p className="error text-center text-red-500 font-semibold">
                {error.message}
              </p>
            )}
            <p className="text-gray-400 text-center">
              By signing up, you agree to our{" "}
              <strong>
                <a href="#">Terms</a>
              </strong>
              ,{" "}
              <strong>
                <a href="#">Data Policy </a>
              </strong>
              and{" "}
              <strong>
                <a href="#">Cookie Policy</a>
              </strong>
              .
            </p>
          </div>
        </div>
        <div className={styles.auth_switcher}>
          <p>
            {authType === "create" ? "Already" : `Don't`} have an account?{" "}
            <Link
              href={`/accounts/auth${
                authType === "login" ? "/create" : "/login"
              }`}
            >
              <a className="text-sky-500">
                {authType === "login" ? "Sign Up" : "Login"}
              </a>
            </Link>
          </p>
        </div>
      </div>
      {saved && (
        <SnackBar saved={saved} setSaved={setSaved} setChange={setChange} />
      )}
    </div>
  );
}

export default Auth;
