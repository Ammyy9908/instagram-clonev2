/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Head from "next/head";
import React from "react";
import Loading from "../../../../components/Loading/Loading";
import Navbar from "../../../../components/Navbar/Navbar";
import SnackBar from "../../../../components/SnackBar/SnackBar";
import useAuth from "../../../../hooks/useAuth";
import getCurrentUserData from "../../../../utils/getUser";
import sendPasswordLink from "../../../../utils/sendPasswordLink";
import styles from "./reset.module.css";

function index() {
  const [user_data, setUserData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [username, setUsername] = React.useState("");
  const [saved, setSaved] = React.useState(false);
  const [change, setChange] = React.useState(false);
  const user = useAuth();
  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
        setUsername(u.email);
      });
    }
  }, [user]);
  console.log("User Data", user_data);

  const handleEmailSend = () => {
    sendPasswordLink(username).then((done) => {
      console.log(done);

      setSaved({
        message: "Password reset link has been sent to your email",
      });
    });
  };
  return (
    <div>
      <Head>
        <title>NextInsta | Reset Password</title>
      </Head>
      <Navbar user={user_data && user_data} />
      {loading && <Loading />}

      <div className={styles.forgot_password_wrapper}>
        <div
          className={`bg-white py-5 px-3 ${styles.forgot_password_container}`}
        >
          <div className={`${styles.forgot_password_box} flex-column gap-2`}>
            <div className={`${styles.forgot_password_icon}`}>
              <span></span>
            </div>
            <h3 className="text-xl font-bold">Trouble with logging in?</h3>
            <p className="mb-3 mt-1 text-gray-400 text-sm">
              Enter your email address, phone number or username, and we`ll send
              you a link to get back into your account.
            </p>
            <div className={styles.custom_input}>
              <input
                type="text"
                name="email_username"
                placeholder="Email,username"
                id="id"
                value={username}
                disabled={true}
              />
            </div>
            <button
              className="w-half send_password_link_btn px-2 py-1 bg-sky-500 text-white text-sm font-bold hover:bg-sky-600 rounded-sm"
              onClick={handleEmailSend}
            >
              Send Password Link
            </button>
          </div>
        </div>
      </div>

      {saved && (
        <SnackBar saved={saved} setSaved={setSaved} setChange={setChange} />
      )}
    </div>
  );
}

export default index;
