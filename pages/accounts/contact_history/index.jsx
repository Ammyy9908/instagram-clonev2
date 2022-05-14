/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { firebase } from "../../../firebaseConfig";
import Head from "next/head";
import React from "react";
import Loading from "../../../components/Loading/Loading";
import Navbar from "../../../components/Navbar/Navbar";
import useAuth from "../../../hooks/useAuth";
import getCurrentUserData from "../../../utils/getUser";
import styles from "./contact.module.css";
import GoogleLogin from "react-google-login";

import loadContacts from "../../../utils/loadContacts";
import saveContacts from "../../../utils/saveContacts";
import Link from "next/link";
import switchProfile from "../../../utils/switchProfessionalAccount";

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

function index() {
  const [loading, setLoading] = React.useState(true);
  const [user_data, setUserData] = React.useState(null);
  const [saved, setSaved] = React.useState(false);
  const [change, setChange] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);
  const [mounted, setMounted] = React.useState(false);

  const user = useAuth();
  console.log("User Updated", user);
  React.useEffect(() => {
    if (user || user_data) {
      setLoading(false);
      getCurrentUserData(user.uid).then((u) => {
        console.log("User Data", u);
        setUserData(u);
        setMounted(true);
        setContacts(u.contacts);
      });
    }
  }, [user]);

  const getContacts = (token) => {
    loadContacts(token)
      .then((r) => {
        console.log(r);
        const { connections } = r;
        if (!connections) {
          return setSaved({
            message: "No Contacts Found! Choose different google account",
          });
        }
        const contacts = connections.map((connection) => {
          return {
            phone: connection.phoneNumbers[0].value,
            uname: connection.names[0].displayName,
          };
        });
        console.log("Contacts", contacts);

        saveContacts(user_data.uid, contacts)
          .then((done) => {
            if (done) {
              setSaved({
                message: "Successfully Contacts Loaded! Reload the Page",
              });
              setContacts(contacts);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const responseGoogle = (response) => {
    console.log(response);
    const { accessToken } = response;
    getContacts(accessToken);
  };

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

  return (
    <div>
      <Head>
        <title>NextInsta | Manage Contacts</title>
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
                    <a className={styles.active_tab}>Manage contacts</a>
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
              <div className={styles.profile_contact_body}>
                <div className={styles.profile_contact_wrapper}>
                  <h2>Manage Contacts</h2>
                  <p className="mt-3">
                    The people listed here are contacts that you`ve uploaded to
                    NextInsta. To remove your synced contacts, tap Delete All.
                    Your contacts will be re-uploaded the next time Instagram
                    syncs your contacts unless you go to your device settings
                    and turn off access to contacts.
                  </p>
                  <p className="mt-5">
                    Only you can see your contacts, but Instagram uses the
                    information you`ve uploaded about your contacts to make
                    friend suggestions for you and others and to provide a
                    better experience for everyone.
                  </p>

                  {contacts && contacts.length <= 0 && (
                    <GoogleLogin
                      clientId="854383202900-nmfjq1rahjr83kh138am84fucmiuj694.apps.googleusercontent.com"
                      render={(renderProps) => (
                        <button
                          onClick={renderProps.onClick}
                          disabled={renderProps.disabled}
                          className={styles.google_contact_load_btn}
                        >
                          Load Contacts
                        </button>
                      )}
                      buttonText="Login"
                      onSuccess={responseGoogle}
                      onFailure={responseGoogle}
                      scope="https://www.googleapis.com/auth/contacts.readonly"
                    />
                  )}

                  {user_data && contacts.length > 0 && (
                    <div className={`${styles.contacts_wrapper} mt-5`}>
                      <div className={`${styles.contact_wrapper_header}`}>
                        <h3>{user_data.contacts.length} synced contacts</h3>
                        <button
                          onClick={() => {
                            removeContacts(user_data.uid)
                              .then((done) => {
                                if (done) {
                                  setSaved({
                                    message:
                                      "Successfully removed all contacts",
                                  });
                                  setContacts([]);
                                }
                              })
                              .catch((e) => {
                                setSaved({
                                  message: "Something went wrong",
                                });
                              });
                          }}
                        >
                          Delete all
                        </button>
                      </div>
                      <div className={styles.contact_list}>
                        {user_data.contacts.map((contact, i) => {
                          return (
                            <div className={styles.contact} key={i}>
                              <h3>{contact.uname}</h3>
                              <p>{contact.phone}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
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
