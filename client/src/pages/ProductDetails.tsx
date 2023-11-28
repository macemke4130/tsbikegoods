import React, { useRef, useEffect, useReducer, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { gql } from "../utils/gql";

import styles from "./ProductDetails.module.scss";

// Components
import Loading from "../components/Loading";
import SuccessfullyListed from "../components/SuccessfullyListed";
import { ProductObject } from "../types/globalTypes";

const reducerInitialState: ProductObject = {
  id: 0,
  dateListed: "",
  descriptionText: "",
  subcategoryId: 0,
  subcategory: "",
  userId: 0,
  sold: false,
  quantity: 0,
  price: 0,
  itemCondition: 0,
  itemConditionName: "",
  title: "",
  brand: 0,
  descriptionId: 0,
  photosId: null,
  categoryId: 0,
  category: "",
  deliveryId: 0,
  descriptionParagraphs: []
}

const reducer = (state: ProductObject, payload: ProductObject): typeof reducerInitialState => {
  const penniesToDollars = payload.price / 100;
  const soldStatus = payload.sold ? "No Longer Available" : "Still Available";
  const descriptionParagraphs: Array<string> = payload.descriptionText?.split("/n");
  const dateListed = new Date(Number(payload.dateListed)).toLocaleDateString();

  return {
    ...payload,
    sold: !!soldStatus,
    price: penniesToDollars,
    descriptionParagraphs,
    dateListed,
  };
};

function ProductDetails() {
  // Ref
  const openGate = useRef(true);

  // State
  const [loading, setLoading] = useState(true);
  const [listSuccess, setListSuccess] = useState(true);
  const [displayName, setDisplayName] = useState("");

  // Reducer
  const [state, dispatch] = useReducer(reducer, reducerInitialState);

  const productId = Number(useParams().id);

  useEffect(() => {
    if (!openGate.current) return;
    openGate.current = false;

    getProductDetails();
    checkSuccess();
  });

  // Get rid of this.
  const checkSuccess = () => setListSuccess(window.location.search.split("success=")[1] === "true");

  const getProductDetails = async () => {
    try {
      const { productDetails } = await gql(
        `{ productDetails(id: ${productId}){ category, subcategory, dateListed, displayName, sold, quantity, price, itemConditionName, title, brandName, deliveryType, descriptionText } }`
      );

      console.info(productDetails);

      if (productDetails) {
        setDisplayName(productDetails.displayName);
        dispatch(productDetails);
        setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className={styles.container}>
      <SuccessfullyListed listSuccess={listSuccess} />
      <nav aria-label="Breadcrumb" data-mb4>
        {state.category && <Link to="#">{state.category}</Link>}
        {state.subcategory && (
          <>
            {" "}
            - <Link to="#">{state.subcategory}</Link>
          </>
        )}
      </nav>
      <div data-pdp-column>
        <section data-image-section aria-label="Product Photo" data-image>
          <img data-image src="../not-found.png" alt="Missing." />
        </section>
        <section data-details-section aria-label="Product Details">
          <h1>{state.title}</h1>
          <div data-price>{state.price === 0 ? "$ Free $" : `$${state.price}`}</div>
          <div data-info-box>
            <div data-quantity>Quantity Available: {state.quantity}</div>
            <div data-condition>Item Condition: {state.itemConditionName}</div>
            <div data-status>Listing Status: {state.sold}</div>
            <div data-seller>
              Listed by <Link to={`/user/${displayName}`}>{displayName}</Link> on {state.dateListed}
            </div>
          </div>
        </section>
      </div>
      {state.descriptionText && (
        <section data-description aria-labelledby="description-title">
          <h2 id="description-title">Product Description</h2>
          {state.descriptionParagraphs.map((p: string, index: number) => (
            <p key={`p-${index}`}>{p}</p>
          ))}
        </section>
      )}
    </div>
  );
}

export default ProductDetails;
