import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LogoutModal from "../components/LogoutModal/LogoutModal";
import Navbar from "../components/Navbar/Navbar";
import Post from "../components/Post/Post";
import StorySection from "../components/StorySection/StorySection";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [logout, setLogout] = React.useState(false);
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar setLogout={setLogout} />

      <div className={`${styles.container}`}>
        <div className={`${styles.app_grid} block lg:grid`}>
          <div className={styles.app_body}>
            <div className="posts">
              <Post image="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
              <Post image="https://images.unsplash.com/photo-1513379733131-47fc74b45fc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
              <Post image="https://images.unsplash.com/photo-1581599129568-e33151627628?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
              <Post image="https://images.unsplash.com/photo-1492288991661-058aa541ff43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
              <Post image="https://images.unsplash.com/photo-1619595956937-f35348cec320?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
            </div>
          </div>
          <div className={`${styles.primary_secondary} hidden lg:block`}>
            <div className={styles.app_user_home_container}>
              <div className={`${styles.app_home_user_avatar}`}></div>
              <div className={styles.app_home_user_info}>
                <Link href="/u/123">
                  <a>
                    <p className="font-semibold">Sumit Bighaniya</p>
                  </a>
                </Link>
                <span className="text-gray-500">sumitbighaniya</span>
              </div>
              <div className={styles.auth_switcher}>
                <span className="text-sky-500 cursor-pointer">Switch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {logout && <LogoutModal />}
    </div>
  );
}
