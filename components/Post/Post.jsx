import React from "react";
import styles from "./Post.module.css";
import { AiFillHeart, AiTwotoneHeart } from "react-icons/ai";
import { BsEmojiLaughing } from "react-icons/bs";
import en from "javascript-time-ago/locale/en";
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import getLocation from "../../utils/getLocation";
import getCurrentUserData from "../../utils/getUser";
import savePost from "../../utils/bookMark";
import { FaBookmark } from "react-icons/fa";
import LikePost from "../../utils/LikePost";
import getPostLikes from "../../utils/getPostLikes";
TimeAgo.addDefaultLocale(en);

function Post({ image, time, lat, long, uid, id, u }) {
  console.log(time, uid);
  const [liked, setLiked] = React.useState(false);
  const [post_liked, setPostLiked] = React.useState(false);
  const [location, setLocation] = React.useState(false);
  const [user, setUser] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [like_count, setLikeCount] = React.useState(null);
  const [likes, setLikes] = React.useState(null);

  React.useEffect(() => {
    getLocation(lat, long)
      .then((data) => {
        console.log(data);
        const { results } = data;
        console.log(results);
        setLocation(results[0].displayAddress);
      })
      .catch((e) => console.log(e));

    // get user of the post
    getCurrentUserData(uid)
      .then((user) => {
        console.log("Post user", user);
        setUser(user);
      })
      .catch((e) => console.log(e));

    // get all likes for the post
    getPostLikes(id, u.uid)
      .then((d) => {
        console.log("Post likes", d);
        setLikes(d.likes);
        if (d.pos) {
          setPostLiked(true);
        }
        setLikeCount(d.likes.length);
      })
      .catch((e) => {
        console.log(e);
      });

    // detect already bookmarked

    isSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  const handlePostSave = () => {
    savePost(user, id)
      .then((r) => {
        console.log(r);
        setBookmarked(true);
      })
      .catch((e) => {
        console.log("Error in saving");
      });
  };

  const handlePostLike = () => {
    LikePost(u, id)
      .then((r) => {
        console.log(r);
        setLikeCount(like_count + 1);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const isSaved = () => {
    if (user && user.saved_posts.includes(id)) {
      setBookmarked(true);
      console.log("runnig");
    }
  };

  return (
    <div className={styles.post}>
      <div className={styles.post_header}>
        <div className={styles.post_header_wrapper}>
          <div className={styles.header_content}>
            <div className="flex gap-5">
              <div className={styles.post_avatar_cirlce}>
                <div className={styles.post_avatar_ellipse}>
                  <img
                    src={
                      user && user.avatar !== "null"
                        ? user.avatar
                        : "https://images.unsplash.com/photo-1502033303885-c6e0280a4f5c?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=9be99762d86ae47ab59690f72d984be6"
                    }
                    alt="some-text"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
              <div className={styles.post_meta}>
                {user && <p>{user.name}</p>}
                {location && (
                  <p className="text-gray-500 text-sm">{location}</p>
                )}
              </div>
            </div>

            <button>
              <img src="/assets/more.svg" alt="" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={styles.post_image}
        onDoubleClick={() => {
          if (!post_liked) {
            setPostLiked(true);
            setLiked(true);
            handlePostLike();
            setTimeout(() => {
              setLiked(false);
            }, 2000);
          } else {
            setLiked(true);
            setTimeout(() => {
              setLiked(false);
            }, 2000);
          }
        }}
      >
        <span
          className={`${styles.heart_post} ${
            liked && styles.heart_post_enable
          }`}
        >
          <AiFillHeart />
        </span>
        <img src={image} alt="" />
      </div>
      <div className={styles.post_footer}>
        <div className={styles.post_footer_controls}>
          <div className={styles.post_footer_controls_primary}>
            <ul className={styles.control_list}>
              <li>
                <button
                  onClick={() => {
                    setPostLiked(!post_liked);
                  }}
                >
                  {post_liked ? (
                    <AiTwotoneHeart
                      style={{
                        color: "red",
                        width: 23,
                        height: 23,
                      }}
                    />
                  ) : (
                    <img src="/assets/Like.svg" alt="" />
                  )}
                </button>
              </li>
              <li>
                <button>
                  <img src="/assets/Comment.svg" alt="" />
                </button>
              </li>
              <li>
                <button>
                  <img src="/assets/SharePosts.svg" alt="" />
                </button>
              </li>
            </ul>
          </div>
          <button onClick={() => handlePostSave()}>
            {bookmarked ? (
              <img src="/assets/Save.svg" alt="" />
            ) : (
              <FaBookmark />
            )}
          </button>
        </div>
        <div className={styles.post_likes_container}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
            className="text-xs"
          >
            <strong>{like_count}</strong>
            <p>Likes</p>
          </span>
        </div>
        <div className={styles.post_comment_section}>
          <div className={styles.user_comment}>
            <div className={`${styles.comment_frame} text-xs`}>
              <span>sumitbighaniya</span>
              <span>
                <p className="text-gray-400">
                  Imperdiet in sit rhoncus...
                  <a href="#more" className=" text-gray-600 underline">
                    more
                  </a>
                </p>
              </span>
            </div>
          </div>
          <div className="comment_header text-xs">
            <p className="text-gray-400">View all 100 comments</p>
          </div>
        </div>
        <div className={styles.post_time}>
          <p className="text-gray-300 text-xs">
            <ReactTimeAgo date={time} locale="en-US" timeStyle="round-minute" />
          </p>
        </div>
        <div className={styles.post_comment_input}>
          <div className={styles.post_comment_input_container}>
            <div className={styles.post_comment_left_section}>
              <button>
                <BsEmojiLaughing />
              </button>
              <input type="text" placeholder="Add a comment..." />
            </div>
            <button>
              <span className="text-sky-300">Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
