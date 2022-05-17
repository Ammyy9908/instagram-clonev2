import React from "react";
import styles from "./RefreshToast.module.css";
import getAllPosts from "../../utils/getAllPosts";
function RefreshToast({ setPhotos, setRefresh,setLoaded }) {
  const handleRefresh = () => {
    getAllPosts()
      .then((r) => {
        console.log(r);
        setLoaded(false);

        setTimeout(() => {
          setPhotos(r);
          setRefresh(false);
        }, 5000);
      })
      .catch((e) => console.log(e));
  };
  return (
    <div className={styles.refresh_toast} onClick={handleRefresh}>
      <span>New Posts</span>
    </div>
  );
}

export default RefreshToast;
