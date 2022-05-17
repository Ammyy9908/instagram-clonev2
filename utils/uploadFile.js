import { firebase } from "../firebaseConfig";
const storage = getStorage();

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

export default async function uploadFile(
  uid,
  filename,
  folder_name,
  setUploading,
  file,
  setChatMedia
) {
  const storageRef = ref(storage, `${folder_name}/${uid}/${filename}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  setUploading(true);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
        url = downloadURL;
        setUploading(false);
        setChatMedia(url);
      });
    }
  );
}
