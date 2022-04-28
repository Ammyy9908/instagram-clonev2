import Head from "next/head";
import Link from "next/link";
import React from "react";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import Navbar from "../components/Navbar/Navbar";
import Post from "../components/Post/Post";
import styles from "../styles/Home.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import getAllPosts from "../utils/getAllPosts";
import BlankPostCard from "../components/BlankPostCard/BlankPostCard";
import { firebase } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";
import getCurrentUserData from "../utils/getUser";
import { useRouter } from "next/router";
import NewPostModal from "../components/NewPostModal/NewPostModal";
import RefreshToast from "../components/RefreshToast/RefreshToast";
const auth = getAuth();
const db = getFirestore();
export default function Home() {
  const [logout, setLogout] = React.useState(false);
  const [user, setUser] = React.useState(false);
  const [photos, setPhotos] = React.useState([]);
  const [newPost, setNewPost] = React.useState(false);
  const [coords, setCoords] = React.useState(null);
  const [refresh, setRefresh] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  const router = useRouter();
  React.useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user && user.uid ? user.uid : null;
        console.log(user);
        const u = await getCurrentUserData(uid);
        setUser(u);
        // ...
      } else {
        // User is signed out
        // ...
        router.push("/accounts/login");
      }
    });
    // update the user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords(position.coords);
        },
        (error) => {
          console.log(error);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getAllPosts()
      .then((r) => {
        console.log(r);
        setPhotos(r);
        setLoaded(true);
      })
      .catch((e) => console.log(e));
  }, []);

  React.useEffect(() => {
    if (loaded) {
      const photo_query = query(collection(db, "photos"));
      const unsub = onSnapshot(photo_query, (querySnapshot) => {
        console.log("New Post Arrive");
        console.log(
          querySnapshot._snapshot.docChanges.length === photos.length
        );
        if (querySnapshot._snapshot.docChanges.length !== photos.length) {
          setRefresh(true);
        }
      });

      return () => unsub();
    }
  }, [loaded, photos.length]);

  console.log(user, photos, coords);
  console.log(refresh);
  return (
    <div>
      <Head>
        <title>InstaNext | TimeLine</title>
        <meta
          name="description"
          content="Generated by create next app & firebase"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar setLogout={setLogout} user={user} setNewPost={setNewPost} />

      <div className={`${styles.container}`}>
        <div className={`${styles.app_grid} block lg:grid`}>
          <div className={styles.app_body}>
            <div className="posts">
              {photos.length > 0 ? (
                photos.map((photo, index) => {
                  return (
                    <Post
                      key={index}
                      image={photo.data.image_path}
                      time={photo.data.date_created}
                      lat={photo.data.latitude}
                      long={photo.data.longitude}
                      uid={photo.data.user_id}
                      id={photo.id}
                      u={user && user}
                    />
                  );
                })
              ) : (
                <>
                  <BlankPostCard />
                  <BlankPostCard />
                  <BlankPostCard />
                  <BlankPostCard />
                  <BlankPostCard />
                  <BlankPostCard />
                  <BlankPostCard />
                </>
              )}
            </div>
          </div>
          <div className={`${styles.primary_secondary}`}>
            {user && (
              <div className={styles.app_user_home_container}>
                <div className={`${styles.app_home_user_avatar}`}>
                  {user.avatar !== "null" ? (
                    <img src={user.avatar} alt="user" />
                  ) : (
                    <p>SK</p>
                  )}
                </div>
                <div className={styles.app_home_user_info}>
                  <Link href={`/u/${user && user.uid}`}>
                    <a>
                      <p className="font-semibold">{user.name}</p>
                    </a>
                  </Link>
                  <span className="text-gray-500">{user.username}</span>
                </div>
                <div className={styles.auth_switcher}>
                  <span className="text-sky-500 cursor-pointer">Switch</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {logout && <LogoutModal />}
      {newPost && (
        <NewPostModal
          user={user && user}
          coords={coords}
          setNewPost={setNewPost}
        />
      )}
      {refresh && (
        <RefreshToast setPhotos={setPhotos} setRefresh={setRefresh} />
      )}
    </div>
  );
}
