import React from "react";
import styles from "./Navbar.module.css";
import { FaRegUserCircle } from "react-icons/fa";
import { GrSettingsOption } from "react-icons/gr";
import { BsBookmark } from "react-icons/bs";
import { MdRestartAlt } from "react-icons/md";
import Link from "next/link";

function NavButton({ children, handler }) {
  return (
    <div className={styles.menu_btn_item} onClick={() => handler(true)}>
      {children}
    </div>
  );
}
function Navbar({ setLogout, user, setNewPost }) {
  const [dropdown, setDropdown] = React.useState(false);

  return (
    <div className={styles.navbar}>
      <div className={[styles.navbar_container]}>
        <div className={styles.nav_main}>
          <div className="brand-logo">
            <Link href="/">
              <a>
                <img src="/assets/insta_logo.png" alt="" />
              </a>
            </Link>
          </div>
          <div className={`${styles.searchbar} hidden lg:flex`}>
            <div className={styles.searchbox}>
              <div className={styles.search}>
                <img src="/assets/search.svg" alt="" />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>
          <div className={styles.navbar_buttons}>
            <NavButton handler={() => {}}>
              <img src="/assets/home.svg" alt="" />
            </NavButton>
            <NavButton handler={() => {}}>
              <img src="/assets/messenger.svg" alt="" />
            </NavButton>
            <NavButton handler={setNewPost}>
              <img src="/assets/new.svg" alt="" />
            </NavButton>
            <NavButton handler={() => {}}>
              <img src="/assets/explore.svg" alt="" />
            </NavButton>
            <NavButton handler={() => {}}>
              <img src="/assets/heart.svg" alt="" />
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
                        <a href="#">
                          <span>
                            <FaRegUserCircle />
                          </span>
                          Profile
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>
                            <BsBookmark />
                          </span>
                          Saved
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <span>
                            <GrSettingsOption />
                          </span>
                          Settings
                        </a>
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
        </div>
      </div>
    </div>
  );
}

export default Navbar;
