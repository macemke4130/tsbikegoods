import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

// Utils
import { gql } from "../utils/gql";
import { waitForDOM } from "../utils/tools";

// Styles
import styles from "./Login.module.scss";

// Types
import { LoginObject } from "../types/globalTypes";

// Global Context
import { StoreContext } from "../globalContext/StoreContext";
import { AuthObject } from "../globalContext/globalReducer";

const observerConfig = { attributes: true, childList: false, subtree: false };

function Login() {
  // Context
  const { authData, setGlobalAuth, alertUser } = useContext(StoreContext);

  // Ref
  const openGate = useRef(true);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const observer = useRef<MutationObserver>();

  // State
  const [loginWindowActive, setLoginWindowActive] = useState(false);
  const [logoutWindowActive, setLogoutWindowActive] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [userPassword, setUserPassword] = useState("");

  // CDM
  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    pageLoadLogin();
  });

  // Enter key listener.
  useEffect(() => {
    window.addEventListener("keydown", handleEnterKey);
    return () => window.removeEventListener("keydown", handleEnterKey);
  });

  // passwordInputWatch mutation observer.
  useEffect(() => {
    if (!passwordInput.current) return;
    observer.current = new MutationObserver(passwordInputWatch);
    observer.current.observe(passwordInput.current, observerConfig);
    return () => observer.current!.disconnect();
  });

  // Prevents a malicious user from changing input type from "password"
  // to "text" to be human readable in the event of a browser autofill.
  const passwordInputWatch: MutationCallback = (mutationList) => {
    const mutation = mutationList[0];
    if (mutation.type === "attributes") {
      // Disconnect prevents an infinite loop.
      observer.current?.disconnect();

      passwordInput.current!.type = "password";
      alertUser("info", "Don't do that.");

      // Reassign observer after mutation.
      observer.current?.observe(passwordInput.current!, observerConfig);
    }
  }

  const pageLoadLogin = async () => {
    const jwt = localStorage.getItem("jwt");
    const emailAddress = localStorage.getItem("emailAddress");
    if (!jwt || !emailAddress) return;

    try {
      const { authorizeJWT } = await gql(`{ authorizeJWT( jwt: "${jwt}", emailAddress: "${emailAddress}"){ id, displayName } }`);

      if (authorizeJWT) {
        const authenticatedUser: AuthObject = {
          jwt,
          emailAddress,
          id: authorizeJWT.id,
          displayName: authorizeJWT.displayName
        }

        setGlobalAuth(authenticatedUser);
      } else {
        clearLocalStorage();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEnterKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && loginWindowActive) {
      e.preventDefault();
      validateLoginFields(e);
    }
  };

  const validateLoginFields = (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | KeyboardEvent) => {
    if (typeof e === "object") e.preventDefault();

    if (!emailAddress || !userPassword) {
      alertUser("info", "Both Fields are Required");
    } else {
      attemptLogin();
    }
  };

  const attemptLogin = async () => {
    try {
      const { userLogin } = await gql(`{userLogin (emailAddress: "${emailAddress}", userPassword: "${userPassword}")
      {success, emailAddress, displayName, jwt, message, id}}`);

      if (!userLogin) {
        alertUser("info", "Email or Password not recognized.");
        return;
      }

      if (userLogin.success) {
        const authenticatedUser: AuthObject = {
          id: userLogin.id,
          jwt: userLogin.jwt,
          emailAddress: userLogin.emailAddress,
          displayName: userLogin.displayName
        }

        setGlobalAuth(authenticatedUser);

        writeLocalStorage(userLogin);
        setLoginWindowActive(false);
      } else {
        alertUser("danger", userLogin.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLoginWindow = () => {
    if (authData.displayName) {
      setLogoutWindowActive(true);
    } else {
      setLoginWindowActive(!loginWindowActive);
      waitForDOM(() => {
        if (!loginWindowActive && emailInput.current) emailInput.current.focus();
      });
    }
  };

  const writeLocalStorage = (userLogin: LoginObject) => {
    localStorage.setItem("jwt", userLogin.jwt);
    localStorage.setItem("emailAddress", userLogin.emailAddress);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("emailAddress");
  };

  const logoutUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const loggedOutUser: AuthObject = {
      id: 0,
      jwt: "",
      emailAddress: "",
      displayName: ""
    }

    setGlobalAuth(loggedOutUser);

    setLogoutWindowActive(false);
    clearLocalStorage();
  };

  const closeWindow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setLoginWindowActive(false);
    setLogoutWindowActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "emailAddress") {
      setEmailAddress(e.target.value);
    }
    if (e.target.id === "userPassword") {
      setUserPassword(e.target.value);
    }
  };

  return (
    <section aria-label="Log In" className={styles.container}>
      <button onClick={toggleLoginWindow} aria-label="Account Info Popup">
        {authData.displayName ? authData.displayName : "Login"}
      </button>
      {logoutWindowActive && (
        <div data-logout-window>
          <button data-window-button aria-label="Close Popup" onClick={closeWindow}>
            X
          </button>
          <Link to={`/user/${authData.displayName}`} onClick={() => setLogoutWindowActive(false)}>My Profile</Link>
          <Link to="/listings" onClick={() => setLogoutWindowActive(false)}>My Listings</Link>
          <Link to="/messages" onClick={() => setLogoutWindowActive(false)}>Messages</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      )}
      {loginWindowActive && (
        <form data-login-window>
          <button data-window-button aria-label="Close Popup" onClick={closeWindow}>
            X
          </button>
          <div data-login-title>Log In</div>
          <label>
            Email:
            <input ref={emailInput} id="emailAddress" type="email" value={emailAddress} onChange={handleInputChange} />
          </label>
          <label>
            Password:
            <input ref={passwordInput} id="userPassword" type="password" value={userPassword} onChange={handleInputChange} />
          </label>
          <button onClick={validateLoginFields}>Submit</button>
          <div data-small>Don't have an account?</div>
          <Link to="/register" onClick={() => toggleLoginWindow()}>Sign Up Here!</Link>
        </form>
      )}
    </section>
  );
}

export default Login;
