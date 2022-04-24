import { useRouter } from "next/router";
import React from "react";
import styles from "./Auth.module.css";
import { FaFacebookSquare } from "react-icons/fa";
//eslint-disable-next-line
import { firebase } from "../../firebaseConfig";
import { getAuth, FacebookAuthProvider, signInWithPopup } from "firebase/auth";
const auth = getAuth();
function FormControl({ placeholder, type }) {
  return (
    <div className={styles.form_control}>
      <input type={type} placeholder={placeholder} />
    </div>
  );
}

function Auth() {
  const router = useRouter();
  const { authType } = router.query;
  console.log(authType);

  const handleFacebookLogin = async () => {
    console.log("login");
    signInWithPopup(auth, new FacebookAuthProvider())
      .then((user) => {
        console.log(user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.auth_container}>
      <div className={styles.auth_box}>
        <div className={styles.auth_box_content}>
          <h3>
            <img src="/assets/insta_logo.png" alt="" />
          </h3>
          <p className="text-gray-500 font-bold">
            Sign up to see photos and videos from your friends.
          </p>
          <button
            onClick={handleFacebookLogin}
            className="flex items-center bg-sky-500 justify-center py-2 text-white gap-3 font-semibold mt-5 mb-5 rounded-sm hover:bg-sky-800 hover:scale-105"
          >
            <FaFacebookSquare />
            <p>Log in with Facebook</p>
          </button>
          <span className="text-center flex items-center justify-center text-gray-300">
            OR
          </span>
          <form action="" className="mt-5">
            <FormControl type="email" placeholder="Email address" />
            <FormControl type="text" placeholder="Full Name" />
            <FormControl type="text" placeholder="Username" />
            <FormControl type="email" placeholder="Password" />
            <input
              type="submit"
              value="Sign Up"
              className="flex items-center justify-center text-white bg-sky-200 px-5 w-full py-2 cursor-pointer mb-5"
            />
          </form>
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
    </div>
  );
}

export default Auth;
