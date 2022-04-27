import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { RiSettingsLine } from "react-icons/ri";
import styles from "./Profile.module.css";
import { BsFillHeartFill } from "react-icons/bs";
import { FaCommentDots, FaPlay } from "react-icons/fa";
import getUserPosts from "../../utils/getUserPosts";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";

import getCurrentUserData from "../../utils/getUser";
import getPost from "../../utils/getPost";
const auth = getAuth();
const db = getFirestore();
import { firebase } from "../../firebaseConfig";

function ProfilePost({ image, type, photoId }) {
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    getPost(photoId)
      .then((post) => {
        console.log("Post, ", post);
        setPost(post);
      })
      .catch((e) => console.log(e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={`${styles.profile_post_item} cursor-pointer`}>
      <img src={post && post.image_path} alt="" />
      <div className={styles.post_overlay}>
        <div className={styles.post_meta_info}>
          <span>
            {type === "photo" ? <BsFillHeartFill /> : <FaPlay />}
            <p>55</p>
          </span>
          <span>
            <FaCommentDots />
            <p>0</p>
          </span>
        </div>
      </div>
    </div>
  );
}

function UserProfilePost({ image, type }) {
  return (
    <div className={`${styles.profile_post_item} cursor-pointer`}>
      <img src={image} alt="" />
      <div className={styles.post_overlay}>
        <div className={styles.post_meta_info}>
          <span>
            {type === "photo" ? <BsFillHeartFill /> : <FaPlay />}
            <p>55</p>
          </span>
          <span>
            <FaCommentDots />
            <p>0</p>
          </span>
        </div>
      </div>
    </div>
  );
}
function User() {
  const [user_posts, setUserPosts] = React.useState([]);
  const [User, setUser] = React.useState(false);
  const router = useRouter();
  const { uid } = router.query;
  const [tab, setTab] = React.useState(0);
  const [fdata, setFdata] = React.useState([]);

  React.useEffect(() => {
    const q = query(collection(db, "followers"));

    const unsub = onSnapshot(q, (querySnapshot) => {
      const d = querySnapshot.docs.map((doc) => doc.data());
      setFdata(d);
    });

    getCurrentUserData(uid)
      .then((user) => {
        console.log("User Profile", user);
        setUser(user);
      })
      .catch((e) => console.log(e));

    // get all posts from a user

    getUserPosts(uid)
      .then((d) => {
        console.log("User Posts", d);
        setUserPosts(d);
      })
      .catch((e) => console.log(e));

    return () => unsub();
  }, [uid]);

  const tagged_posts = [
    {
      id: 2,
      type: "photo",
      author: "rahul",
      thumb:
        "https://images.unsplash.com/photo-1581599129568-e33151627628?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    },
  ];

  const getFollowCount = () => {
    let count_data =
      fdata.length > 0 && fdata.filter((item) => item.following_id == uid);
    return count_data.length;
  };

  const getFollowingCount = () => {
    let count_data =
      fdata.length > 0 && fdata.filter((item) => item.follower_id == uid);
    return count_data.length;
  };

  return (
    <div>
      <Head>
        <title>InstaNext | {`${User ? User.name : ""}`}</title>
        <meta
          name="description"
          content="Generated by create next app & firebase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar user={User} />
      <div className={styles.profile_body}>
        <div className={styles.porfile_header}>
          {User && (
            <div className={styles.profile_user_avatar}>
              <img
                src={
                  User && User.avatar !== "null"
                    ? User.avatar
                    : "https://images.unsplash.com/photo-1502033303885-c6e0280a4f5c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=9be99762d86ae47ab59690f72d984be6"
                }
                alt="some-text"
              />
            </div>
          )}
          <div className={styles.profile_user_info}>
            <div className={styles.user_profile_first}>
              <h3>sumitbighaniya</h3>
              <button className={`${styles.edit_btn} text-sm`}>
                Edit Profile
              </button>
              <button className={styles.setting_btn}>
                <RiSettingsLine />
              </button>
            </div>
            <div className={styles.user_profile_second}>
              <span className={styles.user_info_item}>
                <strong>16</strong>
                <p>posts</p>
              </span>
              <span className={styles.user_info_item}>
                <strong>{getFollowCount()}</strong>
                <p>followers</p>
              </span>
              <span className={styles.user_info_item}>
                <strong>{getFollowingCount()}</strong>
                <p>following</p>
              </span>
            </div>
            <div className="user-profile-third">
              <h3 className="font-semibold">Sumit Bighaniya</h3>
              <span className="text-gray-600">Education</span>
              <p>MERN Stack Developer</p>
              <a href="#" className="text-sky-600">
                linktr.ee/sumitkumarbig
              </a>
            </div>
          </div>
        </div>
        <div className={styles.profile_toggle}>
          <div className={styles.toggle_body}>
            <div
              className={`${styles.toggle_item} ${
                tab === 0 && styles.toogle_item_enable
              } cursor-pointer`}
              onClick={() => setTab(0)}
            >
              <span>
                <img src="/assets/grid.svg" alt="" />
              </span>
              <span>POSTS</span>
            </div>
            <div
              className={`${styles.toggle_item} cursor-pointer ${
                tab === 1 && styles.toogle_item_enable
              }`}
              onClick={() => {
                setTab(1);
              }}
            >
              <span>
                <img src="/assets/save_icon.svg" alt="" />
              </span>
              <span>SAVED</span>
            </div>
            <div
              className={`${styles.toggle_item} ${
                tab === 2 && styles.toogle_item_enable
              } cursor-pointer`}
              onClick={() => setTab(2)}
            >
              <span>
                <img src="/assets/tag.svg" alt="" />
              </span>
              <span>TAGGED</span>
            </div>
          </div>
        </div>
        <div className={styles.profile_posts}>
          {tab === 0 &&
            user_posts.length > 0 &&
            user_posts.map((post, i) => {
              return (
                <UserProfilePost
                  key={i}
                  image={post.image_path}
                  type={"photo"}
                />
              );
            })}
          {tab === 1 &&
            User &&
            User.saved_posts.map((post, i) => {
              return <ProfilePost key={i} photoId={post} type={"video"} />;
            })}

          {tab === 2 &&
            tagged_posts.map((post, i) => {
              return (
                <ProfilePost key={i} image={post.thumb} type={post.type} />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default User;