/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from "next/router";
import React from "react";
import getCurrentUserData from "../../utils/getUser";

import styles from "./ChatItem.module.css";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import useLive from "../../hooks/useLive";

TimeAgo.addDefaultLocale(en);
function ChatItem({ chat, uid }) {
  console.log("chat", chat);
  const router = useRouter();
  const [f, setFrom] = React.useState(null);
  const { from } = chat;

  const activities = useLive(from);
  React.useEffect(() => {
    const getUser = async () => {
      let fromUser = await getCurrentUserData(from);
      console.log("fromUser", fromUser);
      setFrom(fromUser);
    };

    getUser();
  }, []);

  const setChats = async () => {
    router.push(`/direct/chats/to/${from}`);
  };
  return (
    <div className={styles.chat_item} onClick={setChats}>
      <div className={styles.chat_item_wrapper}>
        {f && (
          <div
            className={styles.chat_user}
            style={{
              backgroundImage: `url(${f.avatar})`,
            }}
          >
            {activities.length > 0 && activities[0].live && (
              <span className={styles.user_live_status}></span>
            )}
          </div>
        )}
        <div className={styles.chat_user_meta}>
          {f && <h3>{f.name}</h3>}
          {activities.length > 0 && !activities[0].live && (
            <p className="text-xs text-gray-500">
              Active{" "}
              <ReactTimeAgo
                date={+activities[0].last_login}
                locale="en-US"
                timeStyle="round-minute"
              />{" "}
            </p>
          )}

          {activities.length > 0 && activities[0].live && (
            <p className="text-xs text-gray-500">Active Now</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatItem;
