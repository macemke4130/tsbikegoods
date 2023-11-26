import React, { useRef, useEffect, useReducer, Fragment } from "react";
import { useParams } from "react-router-dom";

import styles from "./Profile.module.scss";

// Types
import { ProfileState, ProductObject } from "../types/globalTypes";
import { gql } from "../utils/gql";
import ProductCard from "../components/ProductCard";
// import { sendAlert } from "../components/AlertUser";

const reducerInitialState: ProfileState = {
  id: 0,
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
  googlepay: "",
  products: []
}

const reducer = (state: ProfileState, payload: ProfileState): typeof reducerInitialState => {
  return {
    ...payload
  }
};

function Profile() {
  const params = useParams();

  // Ref
  const openGate = useRef(true);

  // Reducer
  const [state, dispatch] = useReducer(reducer, reducerInitialState);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    getUserInfo();
  });

  const getUserInfo = async () => {
    const { displayName } = params;

    try {
      const { userInfo } = await gql(`{ userInfo(displayName: "${displayName}") { id, displayName, admin, emailAddress } }`);

      if (userInfo) {
        const userProducts = await getUserProducts(userInfo.id);

        const userData: ProfileState = {
          ...userInfo,
          products: userProducts
        }

        dispatch(userData);
      }
    } catch (e) {
      console.error(e)
    }
  }

  const getUserProducts = async (id: number) => {
    try {
      const r = await gql(`{ userProducts(userId: ${id}) { id, title, price } }`);
      const userProducts: Array<ProductObject> = r.userProducts;

      return userProducts ?? null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  return (
    <div className={styles.container}>
      <h1>{state.displayName}'s Profile</h1>
      {state.products &&
        <section aria-labelledby="recent-products-title">
          <h2 id="recent-products-title">{state.displayName}'s Recent Products</h2>
          <div data-product-grid>
            {state.products?.map((item) => (
              <Fragment key={`productId-${item.id}`}>
                <ProductCard props={item} />
              </Fragment>
            ))}
          </div>
        </section>

      }

    </div >
  );
}

export default Profile;
