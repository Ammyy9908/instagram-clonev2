import { useEffect } from "react";
import styles from "./SnackBar.module.css";
function SnackBar({ saved, setSaved }) {
  useEffect(() => {
    setTimeout(() => {
      setSaved(false);
    }, 5000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`${styles.snack_bar} ${saved && styles.snack_bar_enable}`}>
      <p>{saved.message}</p>
    </div>
  );
}

export default SnackBar;
