import React from "react";
import styles from "./ChatItem.module.css";
function ChatItem({ user, chat_id }) {
  return (
    <div className={styles.chat_item}>
      <div className={styles.chat_item_wrapper}>
        <div className={styles.chat_user}></div>
        <div className={styles.chat_user_meta}>
          <h3>Reciever Name</h3>
          <p className="text-xs text-gray-500">Active 53m ago</p>
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
