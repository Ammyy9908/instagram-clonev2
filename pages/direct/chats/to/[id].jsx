/* eslint-disable react-hooks/exhaustive-deps */
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import Navbar from "../../../../components/Navbar/Navbar";
import useAuth from "../../../../hooks/useAuth";
import styles from "../../../../styles/Direct.module.css";
import { BsEmojiWink, BsHeart } from "react-icons/bs";
import { HiOutlinePencilAlt, HiOutlineReply } from "react-icons/hi";
import ChatItem from "../../../../components/ChatItem/ChatItem";
import InfoIcon from "../../../../components/Icons/InfoIcon";
import getMyChats from "../../../../utils/getMyChats";
import { FiImage, FiMoreHorizontal } from "react-icons/fi";
import getCurrentUserData from "../../../../utils/getUser";
import useChats from "../../../../hooks/useChats";
import axios from "axios";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import Loader from "rsuite/Loader";
import {
  collection,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { MdOutlineEmojiEmotions } from "react-icons/md";

import {
  updateSenderReaction,
  updateRecieverReaction,
} from "../../../../utils/addReaction";

TimeAgo.addDefaultLocale(en);
const db = getFirestore();
const storage = getStorage();
function Direct() {
  const [logout, setLogout] = React.useState(false);
  const [newPost, setNewPost] = React.useState(false);
  const [paddingTop] = React.useState(0);
  const [paddingBottom, setPaddingBottom] = React.useState(0);
  const [chat, setChat] = React.useState(false);
  const [chats, setChats] = React.useState(null);
  const [mounted, setMounted] = React.useState(false);
  const [currentChatUser, setCurrentChatUser] = React.useState(false);
  const [currentChats, setCurrentChats] = React.useState(false);
  const [user_data, setUserData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [emojis, setEmojis] = React.useState(null);
  const [emoji_picker, setEmojiPicker] = React.useState(false);
  const [recent_emojis, setRecentEmojis] = React.useState([]);
  const [activities, setActivities] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [chat_media, setChatMedia] = React.useState(null);
  const [reactions, setReactions] = React.useState(false);
  const router = useRouter();
  const user = useAuth();
  const containerRef = useRef(null);
  const { id } = router.query;
  const [totalChats, setTotalChats] = React.useState(0);

  const allChats = useChats();

  React.useEffect(() => {
    if (allChats.length > 0) {
      setTotalChats(allChats.length);
    }
  }, [allChats]);
  console.log("activities", activities);

  React.useEffect(() => {
    if (router.query.id) {
      const q = query(
        collection(db, "onlineactivities"),
        where("id", "==", router.query.id)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const act = [];
        querySnapshot.forEach((doc) => {
          act.push(doc.data());
        });
        setActivities(act);
      });

      return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  React.useEffect(() => {
    async function fetchEmojis() {
      try {
        const r = await fetch(
          "https://raw.githubusercontent.com/github/gemoji/master/db/emoji.json"
        );
        const data = await r.json();
        setEmojis(data);
      } catch (e) {
        console.log(e);
      }
    }

    fetchEmojis();
  }, []);

  const handleScroll = (e) => {
    console.log(e.target.scrollTop);
    console.log(e.target.scrollHeight);
    console.log(e.target.clientHeight);
    setPaddingBottom(
      e.target.scrollHeight - e.target.scrollTop * 2 - e.target.clientHeight
    );
  };

  React.useEffect(() => {
    if (user || user_data) {
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
      });
    }
  }, [user]);

  React.useEffect(() => {
    if (user) {
      getMyChats(user.uid).then((messages) => {
        console.log(messages);
        setChats(messages);
      });
    }

    if (id) {
      getCurrentUserData(id).then((u) => {
        console.log("Current From Data", u);
        setCurrentChatUser(u);
      });

      setMounted(true);
    }
  }, [user, router.query]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const r = await axios.post(
        `https://nextinstaserver.herokuapp.com/message/${
          user_data && user_data.uid
        }/${currentChatUser && currentChatUser.uid}`,
        {
          message: {
            content: message,
            type: "text",
          },
        }
      );
      console.log(r);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  const sendHeart = async () => {
    try {
      const r = await axios.post(
        `https://nextinstaserver.herokuapp.com/message/${
          user_data && user_data.uid
        }/${currentChatUser && currentChatUser.uid}`,
        {
          message: {
            content: "heart",
            type: "reaction",
          },
        }
      );
      console.log(r);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  const sendMedia = async (media) => {
    try {
      const r = await axios.post(
        `https://nextinstaserver.herokuapp.com/message/${
          user_data && user_data.uid
        }/${currentChatUser && currentChatUser.uid}`,
        {
          message: {
            content: media,
            type: "media",
          },
        }
      );
      console.log(r);
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };

  // handle chat media upload

  const handleChatMedia = (e) => {
    const file = e.target.files[0];
    const { type, size, name } = file;
    console.log(type);
    const allowedExtension = ["image/jpg", "image/jpeg"];
    if (!allowedExtension.includes(type)) {
      console.log("file type not supported");
      return;
    }
    // check size of image also
    if (size > 989388) {
      console.log("file size too large!make sure chat media less than 1mb");
      return;
    } else {
      // upload media
      console.log("Passed");
      uploadFile(file);
    }
  };

  const uploadFile = (file) => {
    const storageRef = ref(storage, `photos/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          sendMedia(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  console.log("Uploading ..", uploading);
  console.log("Chat Media", chat_media);

  if (totalChats !== allChats.length) {
    const element = containerRef.current;
    if (element) {
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  // handle sender reaction

  const handleSenderReaction = (message_id, reaction) => {
    updateSenderReaction(message_id, reaction)
      .then((done) => {
        console.log(done);
      })
      .catch((e) => console.log(e));
  };

  const handleRecieverReaction = (message_id, reaction) => {
    updateRecieverReaction(message_id, reaction)
      .then((done) => {
        console.log(done);
      })
      .catch((e) => console.log(e));
  };

  return (
    <div>
      <Head>
        <title>InstaNext | Direct</title>
        <meta
          name="description"
          content="Generated by create next app & firebase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar
        setLogout={setLogout}
        user={mounted ? user_data : null}
        setNewPost={setNewPost}
        mounted={mounted}
      />

      <div className={styles.direct__body}>
        <div className={styles.direct__body_container}>
          <div className={styles.chats_container}>
            <div className={styles.chat_header}>
              <div className={styles.chat_header_container}>
                <div className={styles.blank_box}></div>
                <div className={styles.chat_author}>
                  <div className={styles.chat_author_container}>
                    <button>
                      {user_data && user_data.name}
                      <span>
                        <svg
                          aria-label="Down Chevron Icon"
                          className="_8-yf5 "
                          color="#262626"
                          fill="#262626"
                          height="20"
                          role="img"
                          viewBox="0 0 24 24"
                          width="20"
                        >
                          <path d="M21 17.502a.997.997 0 01-.707-.293L12 8.913l-8.293 8.296a1 1 0 11-1.414-1.414l9-9.004a1.03 1.03 0 011.414 0l9 9.004A1 1 0 0121 17.502z"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                <button className={styles.new_chat_btn}>
                  <HiOutlinePencilAlt />
                </button>
              </div>
            </div>
            <div
              className={styles.chats_wrapper}
              onScroll={handleScroll}
              style={{
                paddingBottom: paddingBottom,
              }}
            >
              {chats &&
                chats.map((chat, index) => {
                  console.log("ind chat", chat);
                  return (
                    <ChatItem key={index} chat={chat} uid={user && user.uid} />
                  );
                })}
            </div>
          </div>
          <div className={styles.chat_body}>
            {mounted && (
              <div className={styles.chat_body_header}>
                <div className={styles.chat_body_header_wrap}>
                  <div className={styles.chat_body_header_content}>
                    <div className={styles.chat_header_primary}>
                      <div className={styles.chat_primary_content}>
                        <div
                          className={styles.chat_primary_user_avatar}
                          style={{
                            backgroundImage: `url(${currentChatUser.avatar})`,
                          }}
                        ></div>
                        <div className={styles.current_chat_meta}>
                          <button>
                            <div className={styles.current_chat_content}>
                              <h3 className={styles.chat_user_name}>
                                {currentChatUser.name}
                              </h3>
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
                                <p className="text-xs text-gray-500">
                                  Active Now
                                </p>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className={styles.chat_header_controls}>
                      <button>
                        <InfoIcon />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(mounted && !allChats) || allChats.length < 0 ? (
              <div className={styles.chat_body_empty}>
                <div className={styles.empty_chat_icon}>
                  <svg
                    aria-label="Direct"
                    className="_8-yf5 "
                    color="#262626"
                    fill="#262626"
                    height="96"
                    role="img"
                    viewBox="0 0 96 96"
                    width="96"
                  >
                    <circle
                      cx="48"
                      cy="48"
                      fill="none"
                      r="47"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></circle>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="69.286"
                      x2="41.447"
                      y1="33.21"
                      y2="48.804"
                    ></line>
                    <polygon
                      fill="none"
                      points="47.254 73.123 71.376 31.998 24.546 32.002 41.448 48.805 47.254 73.123"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></polygon>
                  </svg>
                </div>
                <div className={styles.empty_chat_title}>
                  <h3>Your messages</h3>
                </div>
                <div className={styles.empty_chat_subtitle}>
                  <h6>
                    Send private photos and messages to a friend or group.
                  </h6>
                </div>
                <button className={styles.new_chat_btn_secondary}>
                  <span>Send message</span>
                </button>
              </div>
            ) : (
              <div className={styles.user_chats} ref={containerRef}>
                {mounted &&
                  user_data &&
                  allChats &&
                  allChats
                    .filter(
                      (chat) =>
                        (chat.from == user_data.uid && chat.to == id) ||
                        (chat.from == id && chat.to == user_data.uid)
                    )
                    .sort(
                      (b, a) => new Date(a.createdAt) - new Date(b.createdAt)
                    )

                    .map((chat, index) => {
                      console.log(user.uid, chat);
                      return (
                        <>
                          {chat.message.type === "text" &&
                            user &&
                            user.uid == chat.from && (
                              <div
                                className={`${styles.chat_bubble} ${
                                  user &&
                                  user.uid == chat.from &&
                                  styles.my_chat
                                }`}
                                key={index}
                              >
                                <p>{chat.message.content}</p>
                              </div>
                            )}

                          {chat.message.type === "text" &&
                            user &&
                            user.uid !== chat.from && (
                              <div
                                className={`${styles.chat_bubble}`}
                                key={index}
                              >
                                <div
                                  className={styles.chat_user}
                                  style={{
                                    backgroundImage: `url(${currentChatUser.avatar})`,
                                  }}
                                ></div>
                                <p>{chat.message.content}</p>
                              </div>
                            )}

                          {chat.message.type === "media" && (
                            <div
                              className={`${styles.chat_media} ${
                                user && user.uid == chat.from && styles.my_chat
                              }`}
                            >
                              <img
                                src={chat.message.content}
                                className={`${styles.chat_media_image}`}
                                alt="message-media"
                              />
                              {chat.sender_reaction ||
                              chat.reciever_reaction ? (
                                <div className={styles.chat_reactions}>
                                  {chat.sender_reaction && (
                                    <span>
                                      <img
                                        src={`/svg/${chat.sender_reaction}.svg`}
                                        alt=""
                                      />
                                    </span>
                                  )}
                                  {chat.reciever_reaction && (
                                    <span>
                                      <img
                                        src={`/svg/${chat.reciever_reaction}.svg`}
                                        alt=""
                                      />
                                    </span>
                                  )}
                                </div>
                              ) : null}
                              <div className={styles.actions}>
                                <button
                                  className={styles.react_btn}
                                  onFocus={() => {
                                    setReactions(true);
                                  }}
                                  onBlur={() => {
                                    setReactions(false);
                                  }}
                                  tabIndex={0}
                                  autoFocus={false}
                                >
                                  <MdOutlineEmojiEmotions />
                                  <div
                                    className={`${styles.reactions} ${
                                      reactions && "reaction_enable"
                                    } ${
                                      user &&
                                      user.uid == chat.from &&
                                      styles.reaction__to
                                    } ${
                                      user &&
                                      user.uid != chat.from &&
                                      styles.reactions__from
                                    }`}
                                  >
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "like"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "like"
                                            );
                                      }}
                                    >
                                      <img src="/svg/like.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "love"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "love"
                                            );
                                      }}
                                    >
                                      <img src="/svg/love.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "care"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "care"
                                            );
                                      }}
                                    >
                                      <img src="/svg/care.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "haha"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "haha"
                                            );
                                      }}
                                    >
                                      <img src="/svg/haha.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "wow"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "wow"
                                            );
                                      }}
                                    >
                                      <img src="/svg/wow.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "sad"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "sad"
                                            );
                                      }}
                                    >
                                      <img src="/svg/sad.svg" alt="" />
                                    </div>
                                    <div
                                      className={styles.reaction}
                                      onClick={() => {
                                        user && user.uid === chat.from
                                          ? handleSenderReaction(
                                              chat.message_id,
                                              "angry"
                                            )
                                          : handleRecieverReaction(
                                              chat.message_id,
                                              "angry"
                                            );
                                      }}
                                    >
                                      <img src="/svg/angry.svg" alt="" />
                                    </div>
                                  </div>
                                </button>
                                <button>
                                  <HiOutlineReply />
                                </button>
                                <button>
                                  <FiMoreHorizontal />
                                </button>
                              </div>
                            </div>
                          )}

                          {chat.message.type === "reaction" &&
                            chat.message.content === "heart" && (
                              <span
                                style={{
                                  fontSize: 32,
                                  color: "red",
                                }}
                                className={`heart_reaction ${
                                  user &&
                                  user.uid == chat.from &&
                                  styles.my_reaction
                                }`}
                              >
                                <BsHeart />
                              </span>
                            )}
                        </>
                      );
                    })}
              </div>
            )}

            {mounted && (
              <div className={styles.new_chat_input_body}>
                <div className={styles.new_chat_custom_input}>
                  <button
                    className={`${styles.emoji_picker_btn} w-45 h-45 flex items-center justify-center`}
                    onFocus={() => setEmojiPicker(true)}
                    onBlur={() => setEmojiPicker(false)}
                    tabIndex="1"
                  >
                    <BsEmojiWink />
                    {emojis && (
                      <div
                        className={`${emoji_picker && "emoji_picker_enable"} ${
                          styles.emoji_picker
                        }`}
                      >
                        <div className={styles.emoji_picker_wrapper}>
                          {/* <div className={styles.emoji_section}>
                            <h3>Most Popular</h3>
                            <div className={styles.popular_emojis}></div>
                          </div> */}
                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Smileys &amp; peoples
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter(
                                  (emoji) =>
                                    emoji.category === "Smileys & Emotion" ||
                                    emoji.category === "People & Body"
                                )
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Animals &amp; natures
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter(
                                  (emoji) =>
                                    emoji.category === "Animals & Nature"
                                )
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Food &amp; Drinks
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter(
                                  (emoji) => emoji.category === "Food & Drink"
                                )
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Actitivies
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter(
                                  (emoji) => emoji.category === "Activities"
                                )
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Travel &amp; places
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter(
                                  (emoji) =>
                                    emoji.category === "Travel & Places"
                                )
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Objects
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter((emoji) => emoji.category === "Objects")
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>

                          <div className={styles.emoji_section}>
                            <h3 className="font-bold text-gray-700 text-left mb-2">
                              Symbols
                            </h3>
                            <div className={styles.emojis_container}>
                              {emojis
                                .filter((emoji) => emoji.category === "Symbols")
                                .map((item, i) => {
                                  return (
                                    <span
                                      key={i}
                                      onClick={() => {
                                        setMessage(message + item.emoji + "  ");
                                      }}
                                    >
                                      {item.emoji}
                                    </span>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                  <form onSubmit={handleSendMessage}>
                    <input
                      type="text"
                      value={message}
                      placeholder="Message..."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </form>

                  <div className={styles.new_chat_extra_controls}>
                    <label htmlFor="image_file" className="bg-indigo-500">
                      <input
                        type="file"
                        name="image_file"
                        id="image_file"
                        onChange={handleChatMedia}
                      />

                      {!uploading && <FiImage />}
                      {uploading && (
                        <div
                          className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full text-gray-300"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </label>

                    <button onClick={sendHeart}>
                      <BsHeart />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Direct;
