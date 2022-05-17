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
import addComment from "../../utils/addComment";
import useComments from "../../hooks/useComments";
import getComment from "../../utils/getComment";
import useLikes from "../../hooks/useLikes";
import useSaved from "../../hooks/useSaved";
import Link from "next/link";
TimeAgo.addDefaultLocale(en);

function Post({ image, time, lat, long, uid, id, u }) {
  console.log(time, uid);
  const [liked, setLiked] = React.useState(false);
  const [post_liked, setPostLiked] = React.useState(false);
  const [location, setLocation] = React.useState(false);
  const [user, setUser] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [like_count, setLikeCount] = React.useState(null);
  const [comment, setComment] = React.useState("");
  const [photo_comments, setPhotoComments] = React.useState(null);
  const [latestComment, setLatestComment] = React.useState(null);

  const cmts = useComments(id);

  const { likes, index } = useLikes(id, u.uid);
  const saved = useSaved(id, u && u.uid);
  console.log("saved", saved);
  React.useEffect(() => {
    getLocation(lat, long)
      .then((data) => {
        const { results } = data;
        setLocation(results[0].displayAddress);
      })
      .catch((e) => console.log(e));
    if (index >= 0) {
      console.log(index);
      setPostLiked(true);
    } else {
      setPostLiked(false);
    }
    if (saved) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }

    // get user of the post
    getCurrentUserData(uid)
      .then((user) => {
        setUser(user);
      })
      .catch((e) => console.log(e));

    cmts.length > 0 &&
      getComment(cmts[cmts.length - 1].comment_id).then((d) => {
        console.log("Latest comment", d);
        setLatestComment(d[0].comment);
      });

    // detect already bookmarked

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, cmts, likes, index, saved]);

  const handlePostSave = () => {
    savePost(user, id)
      .then((r) => {
        setBookmarked(true);
      })
      .catch((e) => {
        console.log("Error in saving");
      });
  };

  const handlePostLike = () => {
    LikePost(u, id)
      .then((r) => {
        setLikeCount(like_count + 1);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleComment = () => {
    addComment(comment, u.uid, id)
      .then((res) => {
        if (res) {
          setComment("");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  console.log(bookmarked);

  return (
    <div className={styles.post}>
      <div className={styles.post_header}>
        <div className={styles.post_header_wrapper}>
          <div className={styles.header_content}>
            <div className="flex gap-5">
              {user && user.avatar && (
                <div className={styles.post_avatar_cirlce}>
                  <div className={styles.post_avatar_ellipse}>
                    <img
                      src={user.avatar}
                      alt="some-text"
                      width={50}
                      height={50}
                    />
                  </div>
                </div>
              )}
              <div className={styles.post_meta}>
                {user && (
                  <p
                    className={`cursor-pointer font-bold text-gray-900 text-sm ${styles.user_post_username}`}
                  >
                    {user.username}

                    <div className={styles.post_user_tooltip}>
                      <div className={styles.post_user_tooltip_header}>
                        <div className={styles.post_user_avatar_wrapper}>
                          <div
                            className={styles.post_user_avatar}
                            style={{
                              backgroundImage: `url(${user.avatar})`,
                              backgroundSize: "cover",
                              borderRadius: "50%",
                            }}
                          ></div>
                        </div>
                        <div className={styles.post_user_tooltip_meta}>
                          <Link href={`/u/${user.uid}`}>
                            <a className="text-sm font-light text-blue-700">
                              {user.username}
                            </a>
                          </Link>
                          <p className="text-gray-600 font-normal mb-2">
                            {user.name}
                          </p>
                          {user.website && (
                            <a
                              href={user.website}
                              className="text-sm font-light text-blue-700"
                            >
                              {user.website}
                            </a>
                          )}
                          <p
                            className={`${styles.post_user_mutual_friends} text-gray-400 font-normal mb-2 text-xs`}
                          >
                            <span>Followed by Mutual1 </span>
                            and 26 more
                          </p>
                        </div>
                      </div>

                      <div
                        className={styles.post_user_follower_post_followings}
                      >
                        <span className={styles.post_item}>
                          <span>41,930</span>
                          <span className="text-gray-400 text-sm font-normal">
                            posts
                          </span>
                        </span>
                        <span className={styles.follower_item}>
                          <span>914k</span>
                          <span className="text-gray-400 text-sm font-normal">
                            followers
                          </span>
                        </span>
                        <span className={styles.following_item}>
                          <span>355</span>
                          <span className="text-gray-400 text-sm font-normal">
                            followings
                          </span>
                        </span>
                      </div>

                      <div className={styles.post_user_recent_posts}>
                        <div className={styles.recent_post}></div>
                        <div className={styles.recent_post}></div>
                        <div className={styles.recent_post}></div>
                      </div>

                      <div className={styles.ppst_user_tooltip_footer}>
                        <button>Message</button>
                        <button>Following</button>
                      </div>
                    </div>
                  </p>
                )}
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
            {!bookmarked ? (
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
            <strong>{likes.length}</strong>
            <p>Likes</p>
          </span>
        </div>
        <div className={styles.post_comment_section}>
          {latestComment && (
            <div className={styles.user_comment}>
              <div className={`${styles.comment_frame} text-xs`}>
                <span>sumitbighaniya</span>
                <span>
                  <p className="text-gray-400">
                    {latestComment}
                    <a href="#more" className=" text-gray-600 underline">
                      more
                    </a>
                  </p>
                </span>
              </div>
            </div>
          )}
          {cmts.length > 0 && (
            <div className="comment_header text-xs">
              <p className="text-gray-400">View all {cmts.length} comments</p>
            </div>
          )}
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
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button onClick={handleComment}>
              <span className="text-sky-300">Post</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
