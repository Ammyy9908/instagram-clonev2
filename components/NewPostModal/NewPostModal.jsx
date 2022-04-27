import React from "react";
import styles from "./NewPostModal.module.css";
import { BsEmojiLaughing } from "react-icons/bs";
import uploadPost from "../../utils/uploadPost";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { firebase } from "../../firebaseConfig";
import { FaBullseye } from "react-icons/fa";
const storage = getStorage();
function NewPostIcon() {
  return (
    <svg
      aria-label="Icon to represent media such as images or videos"
      className="_8-yf5 "
      color="#262626"
      fill="#262626"
      height="77"
      role="img"
      viewBox="0 0 97.6 77.3"
      width="96"
    >
      <path
        d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
        fill="currentColor"
      ></path>
      <path
        d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5l-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
        fill="currentColor"
      ></path>
      <path
        d="M78.2 41.6L61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6l-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
function NewPostModal({ user, coords, setNewPost }) {
  const [caption, setCaption] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [file, setFile] = React.useState(null);
  const [image_url, setUrl] = React.useState(null);
  const handleFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
    const allowed_extensions = ["image/jpg", "image/png", "image/jpeg"];
    const { size, type } = file;
    console.log(file);
    const sizeInMB = bytesToSize(size);
    if (sizeInMB > 3.5) {
      alert("File size is too large");
      return;
    }
    if (!allowed_extensions.includes(type)) {
      alert("File type is not supported");
      return;
    }

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        setImage(reader.result);
      },
      false
    );
    if (file) {
      setFile(file);
      reader.readAsDataURL(file);
    }
  };

  // upload to firebase storage

  const uploadFile = (file) => {
    const storageRef = ref(storage, `photos/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

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
          console.log("File available at", downloadURL);
          const new_post = {
            caption,
            image_path: downloadURL,
            image_size: file.size,
            latitude: coords.latitude,
            longitude: coords.longitude,
            user_id: user.uid,
            date_created: new Date().toISOString(),
          };
          uploadPost(new_post)
            .then((res) => {
              setNewPost(false);
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    );
  };
  return (
    <div className={styles.new_post_popup}>
      <div className={styles.new_post_modal}>
        <div className={styles.new_post_modal_header}>
          <h3>Create a new post</h3>
          {image && (
            <button
              className={`${styles.share_btn} text-sky-500 font-semibold ${
                caption.length < 30 && "text-sky-200"
              }`}
              disabled={caption.length < 30}
              onClick={() => uploadFile(file)}
            >
              Share
            </button>
          )}
        </div>
        <div className={styles.create_new_post_modal_body}>
          {!image ? (
            <div className={styles.modal_center}>
              <NewPostIcon />
              <h3>Drag photos and video here</h3>
              <form action="" encType="multipart/form-data">
                <label htmlFor="file" className={styles.file_btn}>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleFile}
                  />
                  <span>Select from computer</span>
                </label>
              </form>
            </div>
          ) : (
            <div className={styles.modal_post_seclection}>
              <div className={styles.post_image_preview}>
                <img src={image} alt="" />
              </div>
              <div className={styles.new_post_controls}>
                <div className={styles.post_user_header}>
                  <div className={styles.post_user_avatar}></div>
                  <h3>Sumit Bighaniya</h3>
                </div>
                <textarea
                  name="caption"
                  id="caption"
                  rows="10"
                  placeholder="Write a caption...."
                  value={caption}
                  style={{ width: "100%", outline: "none" }}
                  onChange={(e) => setCaption(e.target.value)}
                ></textarea>
                <div className={styles.cation_emoji_container}>
                  <div></div>
                  <span>{caption.length}/2,200</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewPostModal;
