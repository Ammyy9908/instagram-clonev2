/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { firebase } from "../../../firebaseConfig";
import Head from "next/head";
import React from "react";
import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import useAuth from "../../../hooks/useAuth";
import getCurrentUserData from "../../../utils/getUser";
import updateProfile from "../../../utils/updateUserProfile";
import styles from "./edit.module.css";
import { GrClose } from "react-icons/gr";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Link from "next/link";
import switchProfile from "../../../utils/switchProfessionalAccount";
import disableAccount from "../../../utils/disbaleAccount";
import updateUserEmail from "../../../utils/updateUserEmail";

function SnackBar({ saved, setSaved }) {
  React.useEffect(() => {
    setTimeout(() => {
      setSaved(false);
    }, 5000);
  }, []);
  return (
    <div className={`${styles.snack_bar} ${saved && styles.snack_bar_enable}`}>
      <p>{saved.message}</p>
    </div>
  );
}

function RadioInput({
  label,
  id,
  value,
  setValue,
  gender,
  setCustomGender,
  customGender,
  setChange,
}) {
  return (
    <div htmlFor={id} className={styles.custom_radio}>
      <label htmlFor={id} className={styles.radio_component}>
        <input
          type="radio"
          name="gender"
          id={id}
          checked={value === gender}
          onChange={(e) => {
            setValue(value);
            setChange(true);
          }}
        />
        <div className={styles.custom_radio_box_outer}>
          <div
            className={`${styles.custom_radio_inner} ${
              value === gender && styles.custom_radio_inner_enable
            }`}
          ></div>
        </div>
        <div className={styles.custom_label}>
          <span>{label}</span>
          {value === 2 && gender === 2 && (
            <input
              type="text"
              className={styles.custom_gender_box}
              placeholder="Custom"
              value={customGender}
              onChange={(e) => {
                if (!changed) {
                  setChange(true);
                }
                setCustomGender(e.target.value);
              }}
            />
          )}
        </div>
      </label>
    </div>
  );
}

function GenderSelector({
  setGender,
  gender,
  setGenderModal,
  setCustomGender,
  customGender,
  setChange,
  changed,
}) {
  return (
    <div
      className={`${styles.gender_selector} gender_modal`}
      onClick={(e) => {
        if (e.target.classList.contains("gender_modal")) {
          setGenderModal(true);
        }
      }}
    >
      <div className={styles.gender_Selector_modal}>
        <div className={styles.gender_selector_header}>
          <h3>Gender</h3>
          <button
            className={styles.modal_close_btn}
            onClick={() => setGenderModal(false)}
          >
            <GrClose />
          </button>
        </div>
        <div className={styles.gender_modal_body}>
          <div className={styles.gender_options}>
            <RadioInput
              value={0}
              gender={gender}
              setValue={setGender}
              id="male"
              label="Male"
              setCustomGender={setCustomGender}
              customGender={customGender}
              setChange={setChange}
              changed={changed}
            />
            <RadioInput
              value={1}
              gender={gender}
              setValue={setGender}
              id="female"
              label="Female"
              setCustomGender={setCustomGender}
              customGender={customGender}
              setChange={setChange}
              changed={changed}
            />
            <RadioInput
              value={2}
              gender={gender}
              setValue={setGender}
              id="custom"
              label="Custom"
              setCustomGender={setCustomGender}
              customGender={customGender}
              setChange={setChange}
              changed={changed}
            />

            <RadioInput
              value={3}
              gender={gender}
              setValue={setGender}
              id="not-prefer"
              label="Prefer not to say"
              setCustomGender={setCustomGender}
              customGender={customGender}
              setChange={setChange}
              changed={changed}
            />
          </div>
          <button
            className={styles.gender_save_btn}
            onClick={() => setGenderModal(false)}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

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
              onChange={(e) => {
                if (!change) {
                  setChange(true);
                }
                setValue(e.target.value);
              }}
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
  const [gender, setGender] = React.useState(0);
  const [similar, setSimilar] = React.useState(false);
  const [changed, setChange] = React.useState(false);
  const [file, setFile] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const [avatar, setAvatar] = React.useState(null);
  const [gender_modal, setGenderModal] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [customGender, setCustomGender] = React.useState("");
  const [disabled, setDisabled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const user = useAuth();
  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      setMounted(true);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
        setPersonName(u.name);
        setUname(u.username ? u.username : "");
        setWebsite(u.website ? u.website : "");
        setEmail(u.email);
        setPhone(u.phone ? u.phone : "");
        setBio(u.bio ? u.bio : "");
        setGender(u.gender ? u.gender : 0);
        setAvatar(u.avatar);
        setSimilar(u.similar ? u.similar : false);
        setDisabled(u.is_disabled ? u.is_disabled : false);
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
      setChange(true);
      reader.readAsDataURL(file);
    }
  };

  const uploadProfile = async (e) => {
    e.preventDefault();
    if (file) {
      const storageRef = ref(
        storage,
        `photos/avatars/${user.uid}/${file.name}`
      );
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
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            try {
              const email_updated = await updateUserEmail(user, email);
              console.log(email_updated);
              if (email_updated) {
                updateProfile(user_data.uid, {
                  avatar: downloadURL,
                  name: person_name,
                  username: uname,
                  website: website,
                  bio: bio,
                  email: email,
                  phone: phone,
                  gender: gender === 2 ? customGender : gender,
                  similar: similar,
                }).then((done) => {
                  setChange(false);
                  setSaved({ message: "Successfully Profile Updated" });
                });
              }
            } catch (e) {
              console.log(e);
            }
          });
        }
      );
    } else {
      try {
        const email_updated = await updateUserEmail(user, email);
        console.log(email_updated);
        if (email_updated) {
          updateProfile(user_data.uid, {
            avatar: avatar,
            name: person_name,
            username: uname,
            website: website,
            bio: bio,
            email: email,
            phone: phone,
            gender: gender === 2 ? customGender : gender,
            similar: similar,
          }).then((done) => {
            setChange(false);
            setSaved({ message: "Successfully Profile Updated" });
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log(gender === 2 && customGender);
  let genders = ["Male", "Female", customGender, "Not Prefer To Say"];

  const handleAccountSwitch = () => {
    switchProfile(
      user && user.uid,
      user_data.account_type === "professional" ? "personal" : "professional"
    )
      .then((done) => {
        if (done) {
          window.location.reload();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDisbaleAccount = async () => {
    const done = await disableAccount(user && user.uid, true);
    console.log("Done", done);
    if (done) {
      setSaved({
        message: "Account Disabled",
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setSaved({
        message: "Error in Disabling Account",
      });
    }
  };

  const handleEnableAccount = async () => {
    const done = await disableAccount(user && user.uid, false);
    console.log("Done", done);
    if (done) {
      setSaved({
        message: "Account Enabled",
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      setSaved({
        message: "Error in Enabling Account",
      });
    }
  };

  return (
    <div>
      <Head>
        <title>NextInsta | Edit Profile</title>
      </Head>
      {mounted && <Navbar user={user_data && user_data} mounted={mounted} />}
      {loading && <Loading />}

      {user_data && (
        <div className={styles.edit_body}>
          <div className={styles.edit_body_container}>
            <div className={styles.edit_options}>
              <ul className={styles.settings_container}>
                <li>
                  <Link href="/accounts/edit">
                    <a className={styles.active_tab}>Edit Profile</a>
                  </Link>
                </li>
                {user_data.account_type === "professional" && (
                  <li>
                    <Link href="/accounts/professional_account_settings">
                      <a>Professional Account</a>
                    </Link>
                  </li>
                )}
                <li>
                  <Link href="/accounts/password/change">
                    <a>Change Password</a>
                  </Link>
                </li>
                <li>
                  <Link href="/emails/settings">
                    <a>Email notifications</a>
                  </Link>
                </li>
                <li>
                  <Link href="/push/web/settings">
                    <a>Push notifications</a>
                  </Link>
                </li>
                <li>
                  <Link href="/accounts/contact_history">
                    <a>Manage contacts</a>
                  </Link>
                </li>
                <li>
                  <Link href="/accounts/privacy_and_security">
                    <a>Privacy and Security</a>
                  </Link>
                </li>
                <li>
                  <Link href="/sessions/login/activity">
                    <a>Login activity</a>
                  </Link>
                </li>
                <li>
                  <Link href="/emails/email_sent">
                    <a>Email from NextInsta</a>
                  </Link>
                </li>
                <li>
                  <Link href="/settings/help">
                    <a>Help</a>
                  </Link>
                </li>
                <div className={styles.professional_account_switcher}>
                  <div className={styles.professional_account_switcher_content}>
                    <button onClick={handleAccountSwitch}>
                      Switch to{" "}
                      {user_data.account_type === "professional"
                        ? "Personal"
                        : "Professional"}{" "}
                      Account
                    </button>
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
                      {user_data.username}
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
                    id="bio"
                    placeholder="Bio"
                    value={bio}
                    setValue={setBio}
                    form_type="multi"
                    type="text"
                    label="Bio"
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
                      <div
                        className={styles.choice_selector}
                        onClick={() => setGenderModal(true)}
                      >
                        <p>{genders[gender]}</p>
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
                        <input
                          type="checkbox"
                          name="similar"
                          id="similar"
                          onChange={(e) => {
                            setChange(true);
                            setSimilar(!similar);
                          }}
                          checked={similar}
                        />
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
                  </div>
                </form>
                <button
                  onClick={
                    !disabled ? handleDisbaleAccount : handleEnableAccount
                  }
                  className={styles.acount_disabled_account}
                >
                  {!disabled
                    ? "Temporarily disable my account"
                    : "Enable my account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {gender_modal && (
        <GenderSelector
          setGender={setGender}
          gender={gender}
          setGenderModal={setGenderModal}
          setCustomGender={setCustomGender}
          customGender={customGender}
          setChange={setChange}
          changed={changed}
        />
      )}

      {saved && (
        <SnackBar saved={saved} setSaved={setSaved} setChange={setChange} />
      )}
    </div>
  );
}

//GMveaJU25wSvyju1C16Aca9uX5g2
//wzb5k93VVBbefgYfFipRHiBicE02

export default index;
