import React from "react";
import styles from "./Navbar.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { GrSettingsOption } from "react-icons/gr";
import { BsBookmark } from "react-icons/bs";
import { MdRestartAlt } from "react-icons/md";
import { FiInstagram } from "react-icons/fi";
import useAlerts from "../../hooks/useAlerts";
import Link from "next/link";
import getCurrentUserData from "../../utils/getUser";

function NavLink({ children, link }) {
  return (
    <Link href={link}>
      <a>
        <div className={`${styles.menu_btn_item}`}>{children}</div>
      </a>
    </Link>
  );
}

function NavButton({ className, children, handler }) {
  return (
    <div className={`${className} ${styles.menu_btn_item}`} onClick={handler}>
      {children}
    </div>
  );
}

function Navbar({ setLogout, user, setNewPost, mounted }) {
  const [dropdown, setDropdown] = React.useState(false);

  const alerts = useAlerts(user && user.uid);

  console.log("User Alerts", alerts);

  // filter this week messages

  const thisWeekLikeAlerts = () =>
    alerts.filter((alert) => {
      return (
        (0 | (new Date(+alert.created_at).getDate() / 7)) + 1 ===
          (0 | (new Date().getDate() / 7)) + 1 && alert.type === "like"
      );
    });

  const getGenerator = async (uid) => {
    let user = await getCurrentUserData(uid);
    const { name } = user;
    console.log("Generator Name", name);
    return name;
  };

  return (
    <div className={styles.navbar}>
      <div className={[styles.navbar_container]}>
        <div className={styles.nav_main}>
          <div className="brand-logo">
            <Link href="/">
              <a className={styles.logo_large}>
                <img src="/assets/insta_logo.png" alt="" />
              </a>
            </Link>
            <Link href="/">
              <a className={styles.logo_mobile}>
                <FiInstagram
                  style={{
                    width: 28,
                    height: 28,
                  }}
                />
              </a>
            </Link>
          </div>
          {mounted && (
            <div className={`${styles.searchbar} hidden lg:flex`}>
              <div className={styles.searchbox}>
                <div className={styles.search}>
                  <img src="/assets/search.svg" alt="" />
                  <input type="text" placeholder="Search" />
                </div>
              </div>
            </div>
          )}
          {mounted ? (
            <div>
              {user ? (
                <div className={styles.navbar_buttons}>
                  <NavLink link="/">
                    <img src="/assets/home.svg" alt="" />
                  </NavLink>
                  <NavLink link="/direct">
                    <img src="/assets/messenger.svg" alt="" />
                  </NavLink>
                  <NavButton
                    handler={() => {
                      setNewPost(true);
                    }}
                  >
                    <img src="/assets/new.svg" alt="" />
                  </NavButton>
                  <NavLink link="/explore">
                    <img src="/assets/explore.svg" alt="" />
                  </NavLink>
                  <NavButton className={styles.alert_button}>
                    <span className={styles.alert_count}>{alerts.length}</span>
                    <img src="/assets/heart.svg" alt="" />

                    <div className={styles.alert_component}>
                      <div className={styles.alert__section}>
                        {thisWeekLikeAlerts().length > 0 && (
                          <div className={styles.alerts__container}>
                            <div className={styles.alert_label}>This week</div>
                            <div className={styles.alerts}>
                              {thisWeekLikeAlerts().map((alert, i) => {
                                return (
                                  <div className={styles.alert__body} key={i}>
                                    <div className={styles.alert_author}>
                                      <div
                                        className={styles.alert_user}
                                        style={{
                                          backgroundImage: `url(${alert.generated_by.avatar})`,
                                          backgroundSize: "cover",
                                        }}
                                      ></div>
                                    </div>
                                    <div className={styles.alert_text}>
                                      <p className="text-xs">
                                        <strong>
                                          {alert.generated_by.name}
                                        </strong>{" "}
                                        liked your photo. <span>2w</span>
                                      </p>
                                    </div>
                                    <div
                                      className={styles.liked_photo_preview}
                                    ></div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </NavButton>
                  <NavButton>
                    <div
                      className={`${styles.user_avatar} rounded-xl cursor-pointer`}
                      style={{
                        width: "23px",
                        height: "23px",
                        backgroundColor: "#eee",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      tabIndex="1"
                      onClick={() => setDropdown(!dropdown)}
                    >
                      {user && user.avatar !== "null" ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <p className="text-xs">SK</p>
                      )}
                      {dropdown && (
                        <div className={styles.user_dropdown}>
                          <ul className={styles.user_dropdown_list}>
                            <li>
                              <Link href={`/u/${user && user.uid}`}>
                                <a>
                                  <span>
                                    <FaRegUserCircle />
                                  </span>
                                  Profile
                                </a>
                              </Link>
                            </li>
                            <li>
                              <Link href={`/u/${user && user.uid}/saved`}>
                                <a>
                                  <span>
                                    <BsBookmark />
                                  </span>
                                  Saved
                                </a>
                              </Link>
                            </li>
                            <li>
                              <Link href="/accounts/edit">
                                <a>
                                  <span>
                                    <GrSettingsOption />
                                  </span>
                                  Settings
                                </a>
                              </Link>
                            </li>
                            <li>
                              <a href="#">
                                <span>
                                  <MdRestartAlt />
                                </span>
                                Switch accounts
                              </a>
                            </li>
                          </ul>
                          <div
                            className={`${styles.dropdown_footer} flex py-3 py-2 items-center justify-center`}
                          >
                            <button
                              onClick={() => {
                                console.log("clicked");
                                setLogout(true);
                              }}
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </NavButton>
                </div>
              ) : (
                <div className="auth_btn flex gap-2 items-center">
                  <Link href="/accounts/auth/login">
                    <a className="py-1 px-2 bg-sky-600 text-white">Login</a>
                  </Link>
                  <Link href="/accounts/auth/create">
                    <a className="py-1 px-2 bg-white text-sky-600 font-bold">
                      Signup
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.blank_nav_buttons}>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
