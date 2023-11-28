import React, { useRef, useEffect, useReducer, useContext } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./NewUser.module.scss";

// Types
import { DataObject } from "../types/globalTypes";

// Utils
import { gql } from "../utils/gql";
import { StoreContext } from "../globalContext/StoreContext";

interface NewUserState {
  emailAddress: string
  userPassword: string
  retypePassword: string
  displayName: string
  defaultLocation: string
  cash: boolean
  venmo: string
  paypal: string
  cashapp: string
  zelle: string
  applepay: string
  googlepay: string
}

const reducerInitialState: NewUserState = {
  emailAddress: "",
  userPassword: "",
  retypePassword: "",
  displayName: "",
  defaultLocation: "",
  cash: true,
  venmo: "",
  paypal: "",
  cashapp: "",
  zelle: "",
  applepay: "",
  googlepay: ""
}

const reducer = (state: NewUserState, payload: DataObject): typeof reducerInitialState => {
  const dataValue = payload.dataValue;

  switch (payload.dataPoint) {
    case "cash": {
      return {
        ...state,
        cash: !state.cash
      };
    }

    case "displayName": {
      return {
        ...state,
        displayName: dataValue.replaceAll(" ", "").toLowerCase()
      };
    }

    default: {
      return {
        ...state,
        [payload.dataPoint]: dataValue,
      };
    }
  }
};

function NewUser() {
  const navigate = useNavigate();

  const { alertUser } = useContext(StoreContext);

  // Ref
  const openGate = useRef(true);
  // const alertUserRef = useRef<JSX.Element>(null);

  // State

  // Reducer
  const [state, dispatch] = useReducer(reducer, reducerInitialState);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;
  });

  const inputReducer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const dataPoint = target.dataset.point!;
    const dataValue = target.value;

    dispatch({ dataPoint, dataValue });
  };

  const radioReducer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const dataPoint = target.dataset.point!;
    const dataValue = target.value;

    dispatch({ dataPoint, dataValue });
  }

  const handleClickNewUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    const passwordLength = (state.userPassword.length >= 8) ? true : false;
    const passwordsMatch = (state.userPassword === state.retypePassword) ? true : false;

    if (!state.emailAddress) {
      alertUser("info", "Email Address is required!");
      return;
    }

    if (!passwordLength) {
      alertUser("info", "Password must be at least 8 characters.");
      return;
    }

    if (!passwordsMatch) {
      alertUser("info", "Passwords must match.");
      return;
    }

    if (!state.displayName) {
      alertUser("info", "Display Name is required.");
      return;
    }

    sendNewUserToDB();
  }

  const sendNewUserToDB = async () => {
    const mutation = `mutation { newUser(
      emailAddress: "${state.emailAddress}",
      userPassword: "${state.userPassword}",
      displayName: "${state.displayName}",
      defaultLocation: "${state.defaultLocation}",
      cash: ${state.cash},
      venmo: "${state.venmo}",
      paypal: "${state.paypal}",
      cashapp: "${state.cashapp}",
      zelle: "${state.zelle}",
      applepay: "${state.applepay}",
      googlepay: "${state.googlepay}"

    ) { insertId } }`
    console.info(mutation);

    try {
      const { newUser } = await gql(mutation);

      if (newUser.insertId) {
        navigate(`/user-${newUser.insertId}`)
      }

    } catch (e) {

    }

  }

  return (
    <div className={styles.container}>
      <h1>Register New User</h1>
      <form id="register-new-user" aria-label="New User">
        <fieldset data-flex-col>
          <legend>Basic Information</legend>
          <label data-flex-col>
            Email Address*
            <input data-point="emailAddress" type="email" value={state.emailAddress} onChange={inputReducer} required />
          </label>
          <label data-flex-col>
            Password*
            <input data-point="userPassword" type="password" value={state.userPassword} onChange={inputReducer} required />
            <span data-small>Your password can be whatever the hell you want, as long as it's at least 8 characters.</span>
          </label>
          <label data-flex-col>
            Re-Type Password*
            <input data-point="retypePassword" type="password" value={state.retypePassword} onChange={inputReducer} required />
          </label>
          <label data-flex-col>
            Display Name*
            <input data-point="displayName" type="text" value={state.displayName} onChange={inputReducer} required />
            <span data-small>No spaces or capital letters.</span>
          </label>
          <label data-flex-col>
            Default Location:
            <input data-point="defaultLocation" type="text" value={state.defaultLocation} onChange={inputReducer} />
            <span data-small>Used for Local Pickup items.</span>
          </label>
        </fieldset>

        <fieldset data-flex-col>
          <legend>Default Payment Methods</legend>
          <span data-small data-mb4>If these fields are filled out, they will be options for you to choose from when you list items for sale. Some items you may be fine accepting Venmo, but others you may prefer cash only. It is up to you when you create your listings.</span>

          <label data-flex-col>Cash:
            <label>Accepted <input data-point="cash" type="radio" name="cash" value="true" checked={state.cash === true} onChange={radioReducer} data-ml2 /></label>
            <label>Not Accepted<input data-point="cash" type="radio" name="cash" value="false" checked={state.cash === false} onChange={radioReducer} data-ml2 /></label>
          </label>

          <label data-flex-col>Venmo
            <input data-point="venmo" type="text" value={state.venmo} onChange={inputReducer} />
          </label>

          <label data-flex-col>PayPal
            <input data-point="paypal" type="text" value={state.paypal} onChange={inputReducer} />
          </label>

          <label data-flex-col>CashApp
            <input data-point="cashapp" type="text" value={state.cashapp} onChange={inputReducer} />
          </label>

          <label data-flex-col>Zelle
            <input data-point="zelle" type="text" value={state.zelle} onChange={inputReducer} />
          </label>

          <label data-flex-col>ApplePay
            <input data-point="applepay" type="text" value={state.applepay} onChange={inputReducer} />
          </label>

          <label data-flex-col>GooglePay
            <input data-point="googlepay" type="text" value={state.googlepay} onChange={inputReducer} />
          </label>

        </fieldset>

        <div data-submit>
          <button onClick={handleClickNewUser}>Register</button>
        </div>
      </form>
    </div>
  );
}

export default NewUser;
