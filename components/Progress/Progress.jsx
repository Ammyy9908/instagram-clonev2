import React from "react";
import styles from "./Progress.module.css";
function Progress() {
  return (
    <div className={styles.progress}>
      <div className={styles.progress_value}></div>
    </div>
  );
}

export default Progress;
