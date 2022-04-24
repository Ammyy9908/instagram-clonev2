import React from "react";
import Logo from "../../public/assets/Icons/Logo";
import styles from "./Navbar.module.css";

function NavButton({ children }) {
  return <div className={styles.menu_btn_item}>{children}</div>;
}
function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={[styles.navbar_container]}>
        <div className={styles.nav_main}>
          <div className="brand-logo">
            <a href="#">
              <img src="/assets/insta_logo.png" alt="" />
            </a>
          </div>
          <div className={styles.searchbar}>
            <div className={styles.searchbox}>
              <div className={styles.search}>
                <img src="/assets/search.svg" alt="" />
                <input type="text" placeholder="Search" />
              </div>
            </div>
          </div>
          <div className={styles.navbar_buttons}>
            <NavButton>
              <img src="/assets/home.svg" alt="" />
            </NavButton>
            <NavButton>
              <img src="/assets/messenger.svg" alt="" />
            </NavButton>
            <NavButton>
              <img src="/assets/new.svg" alt="" />
            </NavButton>
            <NavButton>
              <img src="/assets/explore.svg" alt="" />
            </NavButton>
            <NavButton>
              <img src="/assets/heart.svg" alt="" />
            </NavButton>
            <NavButton>
              <div
                className="user_avatar rounded-xl"
                style={{
                  width: "23px",
                  height: "23px",
                  backgroundColor: "#eee",
                }}
              ></div>
            </NavButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
