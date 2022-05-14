/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { firebase } from "../../../../firebaseConfig";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import Loading from "../../../../components/Loading/Loading";
import Navbar from "../../../../components/Navbar/Navbar";
import useAuth from "../../../../hooks/useAuth";
import styles from "./change.module.css";
import checkOldPassword from "../../../../utils/checkOldPassword";
import Link from "next/link";
import getCurrentUserData from "../../../../utils/getUser";
import switchProfile from "../../../../utils/switchProfessionalAccount";
import changePassword from "../../../../utils/changeUserPassword";

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

function index() {
  const [loading, setLoading] = React.useState(true);
  const [user_data, setUserData] = React.useState(null);
  const [old_password, setOldPassword] = React.useState("");
  const [new_password, setNewPassword] = React.useState("");
  const [confirm_new_password, setConfirmNewPassword] = React.useState("");
  const [changed, setChange] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const user = useAuth();

  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
        setMounted(true);
      });
    }
  }, [user]);

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

  // hande Change Password

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // check password first
    checkOldPassword(user_data.email, old_password)
      .then((is_valid) => {
        if (!is_valid) {
          setSaved({
            message:
              "Your old password has been entered incorrectly. Please enter it again.",
          });
        } else {
          // check for new & confirm password
          if (!new_password || !confirm_new_password) {
            setSaved({
              message: "Make sure all fields are filled.",
            });
            return;
          }
          if (new_password.length < 6 || confirm_new_password.length < 6) {
            setSaved({
              message: "Password must be at least 6 characters long.",
            });
            return;
          }
          if (new_password !== confirm_new_password) {
            setSaved({
              message: "Two Passwords do not match.",
            });
            return;
          }
          // now change the user password
          changePassword(user, new_password).then((done) => {
            console.log(done);
            if (!done) {
              setSaved({
                message: "Something went wrong. Please try again later.",
              });
            } else {
              setSaved({
                message: "Password changed successfully.",
              });
            }
          });
        }
      })
      .catch((e) => {
        console.log("e", e);
      });
  };
  return (
    <div>
      <Head>
        <title>NextInsta | Change Password</title>
      </Head>
      <Navbar user={user_data && user_data} mounted={mounted} />
      {loading && <Loading />}

      {user_data && (
        <div className={styles.edit_body}>
          <div className={styles.edit_body_container}>
            <div className={styles.edit_options}>
              <ul className={styles.settings_container}>
                <li>
                  <Link href="/accounts/edit">
                    <a>Edit Profile</a>
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
                    <a className={styles.active_tab}>Change Password</a>
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
              <div className={styles.password_setting_body}>
                <div className={styles.password_setting_header}>
                  <div
                    className={styles.password_setting_header_avatar_wrapper}
                  >
                    <div className={styles.password_header_avatar}>
                      <button>
                        {user_data && <img src={user_data.avatar} alt="" />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.password_user_information}>
                    <h1 className={styles.password_setting_user_name}>
                      {user_data.username}
                    </h1>
                  </div>
                </div>
                <form
                  action=""
                  className={styles.user_profile_edit_form}
                  onSubmit={handlePasswordChange}
                >
                  <FormControlBox
                    id="old_pass"
                    placeholder=""
                    value={old_password}
                    setValue={setOldPassword}
                    form_type="single"
                    type="password"
                    label="Old password"
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="new_pass"
                    placeholder=""
                    value={new_password}
                    setValue={setNewPassword}
                    form_type="single"
                    type="password"
                    label="New password"
                    setChange={setChange}
                    change={changed}
                  />
                  <FormControlBox
                    id="confirm_pass"
                    placeholder=""
                    value={confirm_new_password}
                    setValue={setConfirmNewPassword}
                    form_type="single"
                    type="password"
                    label="Cofirm new password"
                    setChange={setChange}
                    change={changed}
                  />

                  <div className={styles.form_submit_controller}>
                    <input
                      type="submit"
                      value="Change Password"
                      className={!changed ? styles.disabled : null}
                    />
                  </div>
                </form>
                <Link href="/accounts/password/reset">
                  <a
                    className="mt-5 block text-sky-500 font-bold"
                    style={{
                      width: "75%",
                      marginLeft: "auto",
                      marginRight: "auto",
                    }}
                  >
                    Forgot Password?
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
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
