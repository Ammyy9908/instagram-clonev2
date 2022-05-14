/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../../../components/Navbar/Navbar";
import useAuth from "../../../../hooks/useAuth";
import getCurrentUserData from "../../../../utils/getUser";
import Loading from "../../../../components/Loading/Loading";
import styles from "./confirm.module.css";
import handlePasswordReset from "../../../../utils/handleResetPassword";
import ConfirmPasswordAsync from "../../../../utils/confirmPassword";
import SnackBar from "../../../../components/SnackBar/SnackBar";
import Link from "next/link";

function index() {
  const [loading, setLoading] = React.useState(true);
  const [user_data, setUserData] = React.useState(null);
  const [logout, setLogout] = React.useState(false);
  const [newPost, setNewPost] = React.useState(false);
  const [valid, setValid] = React.useState(false);

  const user = useAuth();

  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
      });
    }
  }, [user]);

  // get all query params
  const { query } = useRouter();
  console.log("Query", query);
  const { mode, oobCode, apiKey, lang } = query;
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [change, setChange] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [email, setEmail] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (mode && oobCode && apiKey && lang) {
      handlePasswordReset(
        oobCode,
        "http://localhost:3000/account/password/confirm",
        lang,
        apiKey
      ).then((done) => {
        setEmail(done.email);
        if (done) {
          setValid(true);

          return;
        }
        setMounted(true);
        setLoading(false);
      });
    }
  }, [query]);

  const handleResetPassword = (e) => {
    e.preventDefault();
    ConfirmPasswordAsync(email, password, oobCode).then((done) => {
      if (done) {
        setSaved({
          message: "Password has been changed",
        });
        setTimeout(() => {
          window.location.href = "/accounts/auth/login";
        }, 3000);
      } else {
        console.log("Password Not Updated");
      }
    });
  };
  return (
    <div>
      <Head>
        <title>NextInsta | Reset Password</title>
      </Head>
      <Navbar
        setLogout={setLogout}
        user={user_data}
        setNewPost={setNewPost}
        mounted={mounted}
      />

      {!loading ? (
        <div className={styles.cofirm_password_body}>
          <div className="cofirm_password_wrapper">
            {!valid ? (
              <div className="text-center">
                <h3 className="text-3xl font-semibold mb-2">
                  Sorry, this page isn`t available.
                </h3>
                <p>
                  The link you followed may be broken, or the page may have been
                  removed.
                  <Link href="/accounts/auth/login">
                    <a className="text-sky-600 pl-2">Go back to NextInsta</a>
                  </Link>
                </p>
              </div>
            ) : (
              <div className={styles.confirm_password_box}>
                <div className={styles.password_box_body}>
                  <h1 className="text-xl mb-2 font-bold">
                    Create new Password
                  </h1>
                  <p className="text-sm text-gray-600 mb-3">
                    Your password must be at least six characters and should
                    include a combination of numbers, letters and special
                    characters (!$@％).
                  </p>
                  <form onSubmit={handleResetPassword}>
                    <div className={styles.custom_field}>
                      <input
                        type="password"
                        name="password"
                        placeholder="New Password"
                        value={password}
                        autoComplete="off"
                        onChange={(e) => {
                          if (!change) {
                            setChange(true);
                          }
                          setPassword(e.target.value);
                        }}
                      />
                    </div>
                    <div className={styles.custom_field}>
                      <input
                        type="password"
                        name="password"
                        placeholder="New Password, again"
                        value={confirmPassword}
                        autoComplete="off"
                        onChange={(e) => {
                          if (!change) {
                            setChange(true);
                          }
                          setConfirmPassword(e.target.value);
                        }}
                      />
                    </div>
                    <input
                      type="submit"
                      value="Reset Password"
                      disabled={!change && true}
                      className={`bg-sky-200 text-white py-3 px-2 w-full mt-5 mb-5 ${
                        change && styles.enabled_btn
                      }`}
                    />
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Loading />
      )}

      {saved && (
        <SnackBar saved={saved} setSaved={setSaved} setChange={setChange} />
      )}
    </div>
  );
}

export default index;
