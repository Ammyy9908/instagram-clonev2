import React from "react";
import styles from "./BlankPostCard.module.css";
function BlankPostCard() {
  return (
    <div className={styles.blank_post}>
      <div className={styles.blank_post_header}>
        <div className={styles.blank_post_header_wrapper}>
          <div className={styles.blank_post_header_user}>
            <div className={styles.blank_user_avatar}></div>
            <div className={styles.blank_user_meta}>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.black_post_image_box}></div>
    </div>
  );
}

export default BlankPostCard;
