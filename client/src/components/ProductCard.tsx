import React from "react";
import { Link } from "react-router-dom";

import styles from "./ProductCard.module.scss";

import { ProductObject } from "../types/globalTypes";

function ProductCard({ props }: { props: ProductObject }) {
    return (
        <Link id={`productId-${props.id}`} data-product-card to={`/product/${props.id}`} className={styles.container}>
            <img src="../not-found.png" alt="Missing" data-product-image />
            <h3 data-product-title>{props.title}</h3>
            <div data-product-price>{props.price === 0 ? "Free" : `$${props.price}`}</div>
        </Link>
    )
}

export default ProductCard;