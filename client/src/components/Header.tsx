import React from "react";

import Navigation from "./Navigation";
import Login from "./Login";

import styles from "./Header.module.scss";

function Header() {
  return (
    <header className={styles.container}>
      <div data-wrapper>
        <img data-logo src="./logo.png" alt="Site Logo" />
        <Navigation />
        <Login />
      </div>
    </header>
  );
}

export default Header;
