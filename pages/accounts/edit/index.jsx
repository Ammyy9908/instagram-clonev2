/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { firebase } from "../../../firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import useAuth from "../../../hooks/useAuth";
import getCurrentUserData from "../../../utils/getUser";
import updateProfile from "../../../utils/updateUserProfile";
import styles from "./edit.module.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

function FormControlBox({
  id,
  label,
  placeholder,
  type,
  value,
  setValue,
  form_type,
  disabled,
  change,
  setChange,
}) {
  console.log("Incoming Form Data", {
    id,
    label,
    placeholder,
    type,
    value,
    setValue,
  });
  return (
    <div className={styles.form_control_box}>
      <aside>
        <label htmlFor={id}>{label}</label>
      </aside>
      <div className={styles.form_control_wrapper}>
        <div className={styles.form_control_input_helper}>
          {form_type === "single" ? (
            <input
              type={type}
              placeholder={placeholder}
              id={id}
              value={value}
              onChange={(e) => {
                if (!change) {
                  setChange(true);
                }
                setValue(e.target.value);
              }}
              autoComplete="off"
              className={disabled && styles.disabled}
              disabled={disabled}
            />
          ) : (
            <textarea
              id={id}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "n/a";
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i === 0) return `${bytes} ${sizes[i]})`;
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
}
const storage = getStorage();
function index() {
  const [loading, setLoading] = React.useState(true);
  const [user_data, setUserData] = React.useState(null);
  const [person_name, setPersonName] = React.useState(
    user_data ? user_data.username : ""
  );
  const [uname, setUname] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [gender, setGender] = React.useState("");
  const [similar, setSimilar] = React.useState("");
  const [changed, setChange] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const router = useRouter();
  const user = useAuth();
  console.log("User Updated", user);
  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
        setPersonName(u.name);
        setUname(u.username);
        setWebsite(u.website);
        setEmail(u.email);
        setPhone(u.phone);
        setBio(u.bio);
        setGender(u.gender);
        setAvatar(u.avatar);
      });
    }
  }, [user]);

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

  const uploadProfile = (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `photos/avatars/${user.uid}/${file.name}`);
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
          updateProfile(user_data.uid, {
            avatar: downloadURL,
            name: person_name,
            username: uname,
            website: website,
            bio: bio,
            email: email,
            phone: phone,
          }).then((done) => {
            console.log(done);
          });
        });
      }
    );
  };

  return (
    <div>
      <Head>
        <title>NextInsta | Edit Profile</title>
      </Head>
      <Navbar />
      {loading && <Loading />}

      {user_data && (
        <div className={styles.edit_body}>
          <div className={styles.edit_body_container}>
            <div className={styles.edit_options}>
              <ul className={styles.settings_container}>
                <li>
                  <a href="#">Edit Profile</a>
                </li>
                <li>
                  <a href="#">Professional Account</a>
                </li>
                <li>
                  <a href="#">Change Password</a>
                </li>
                <li>
                  <a href="#">Email notifications</a>
                </li>
                <li>
                  <a href="#">Push notifications</a>
                </li>
                <li>
                  <a href="#">Manage contacts</a>
                </li>
                <li>
                  <a href="#">Privacy and Security</a>
                </li>
                <li>
                  <a href="#">Login activity</a>
                </li>
                <li>
                  <a href="#">Email from NextInsta</a>
                </li>
                <li>
                  <a href="#">Help</a>
                </li>
                <div className={styles.professional_account_switcher}>
                  <div className={styles.professional_account_switcher_content}>
                    <button>Swicth to Professional Account</button>
                  </div>
                </div>
                <div className={styles.account_center_block}>
                  <hr />
                  <div className={styles.account_center_content}>
                    <div>
                      <a href="#">NextInsta</a>
                    </div>
                    <div>
                      <a href="#" className="text-sky-400">
                        Accounts Center
                      </a>
                    </div>
                    <p className="text-sm text-gray-400">
                      Control settings for connected experiences across
                      Instagram, the Facebook app and Messenger, including story
                      and post sharing, and logging in.
                    </p>
                  </div>
                </div>
              </ul>
            </div>
            <div className={styles.setting_body}>
              <div className={styles.profile_setting_body}>
                <div className={styles.profile_setting_header}>
                  <div className={styles.profile_setting_header_avatar_wrapper}>
                    <div className={styles.profile_header_avatar}>
                      <button>
                        {user_data && (
                          <img src={image ? image : user_data.avatar} alt="" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className={styles.profile_user_information}>
                    <h1 className={styles.profile_seeting_user_name}>
                      sumitbighaniya
                    </h1>

                    <label htmlFor="file" className={styles.profile_change_btn}>
                      <input
                        type="file"
                        name="file"
                        id="file"
                        onChange={handleFile}
                      />
                      <span>Change Profile Photo</span>
                    </label>
                  </div>
                </div>
                <form
                  action=""
                  className={styles.user_profile_edit_form}
                  onSubmit={uploadProfile}
                >
                  <FormControlBox
                    id="person_name"
                    placeholder="Person Name"
                    value={person_name}
                    setValue={setPersonName}
                    form_type="single"
                    type="text"
                    label="Name"
                    disabled={true}
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="uname"
                    placeholder="Username"
                    value={uname}
                    setValue={setUname}
                    form_type="single"
                    type="text"
                    label="Username"
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="website"
                    placeholder="Website"
                    value={website}
                    setValue={setWebsite}
                    form_type="single"
                    type="text"
                    label="Website"
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="email"
                    placeholder="Email address"
                    value={email}
                    setValue={setEmail}
                    form_type="single"
                    type="email"
                    label="Email address"
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="phone"
                    placeholder="Phone number"
                    value={phone}
                    setValue={setPhone}
                    form_type="single"
                    type="text"
                    label="Phone number"
                    setChange={setChange}
                    change={changed}
                  />

                  <div className={styles.form_choice_controller}>
                    <aside>
                      <label htmlFor="gender">Gender</label>
                    </aside>
                    <div className={styles.choice_controller}>
                      <div className={styles.choice_selector}>
                        <p>Male</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.form_choice_controller}>
                    <aside>
                      <label htmlFor="similar">
                        Similar account suggestions
                      </label>
                    </aside>

                    <div className={styles.choice_controller}>
                      <div className="checked_input">
                        <input type="checkbox" name="similar" id="similar" />
                        <p>
                          Include your account when recommending similar
                          accounts that people might want to follow
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.form_submit_controller}>
                    <input
                      type="submit"
                      value="Submit"
                      className={!changed ? styles.disabled : null}
                    />
                    <button>Temporarily disable my account</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//GMveaJU25wSvyju1C16Aca9uX5g2
//wzb5k93VVBbefgYfFipRHiBicE02

export default index;
