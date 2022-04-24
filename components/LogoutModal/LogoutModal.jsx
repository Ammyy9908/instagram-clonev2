import { useRouter } from "next/router";
import React from "react";
import styles from "./LogoutModal.module.css";
function LogoutModal() {
  const router = useRouter();

  React.useEffect(() => {
    setTimeout(() => {
      router.push("/accounts/login");
    }, 5000);
  }, [router]);
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
