import { useRouter } from "next/router";
import React from "react";
import styles from "./LogoutModal.module.css";
import { getAuth, signOut } from "firebase/auth";
import { firebase, db } from "../../firebaseConfig";

function LogoutModal() {
  const router = useRouter();
  const auth = getAuth();

  React.useEffect(() => {
    signOut(auth)
      .then(() => {
        console.log("loggedout");
        router.push("/accounts/login");
      })
      .catch((e) => {
        console.log(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.modal_overlay}>
      <div className={`${styles.logout_modal}`}>
        <div className={styles.logout_modal_body}>
          <h3 className="text-lg font-semibold">Logging out</h3>
          <p className="text-gray-400">you need to log back in</p>
        </div>
        <div className={styles.logout_modal_footer}>
          <button>Log In</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
