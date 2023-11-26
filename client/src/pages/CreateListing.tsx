import React, { useReducer, useRef, useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
import { gql } from "../utils/gql";

import styles from "./CreateListing.module.scss";

import { StateObject, ValidDataPoint, ConfigObject, DataObject, ServerOptionsObject, SubcategoryObject, SubCategoryArray, BrandObject, CategoryObject, ItemConditionObject, DeliveryObject } from "./CreateListingTypes";

const config: ConfigObject = {
    requiredState: ["brandInput", "categoryId", "title", "quantity", "itemCondition", "deliveryId"],
    databaseLists: {
        categories: [],
        subcategories: [],
        brands: [],
    },
};

const reducerInitialState: StateObject = {
    brandSelect: 0,
    brandInput: "",
    categoryId: 0,
    subcategoryId: 0,
    title: "",
    quantity: 1,
    itemCondition: 0,
    price: 0,
    deliveryId: 0,
    descriptionText: "",
    descriptionCharacterCount: 2000
}

const findBrandId = (value: string) => {
    const brandIdFromPayload = Number(value);
    const brandIndex = config.databaseLists.brands.findIndex((item) => item.id === brandIdFromPayload);
    return brandIndex;
}

const reducer = (state: StateObject, payload: DataObject): typeof reducerInitialState => {
    const dataValue = payload.dataValue;

    // Prevent user from selecting a "0" option. 
    if (dataValue === "0") return { ...state };

    switch (payload.dataPoint) {
        case "brandSelect": {
            const brandIndex = findBrandId(payload.dataValue);
            const brandString = config.databaseLists.brands[brandIndex].brandName;

            return {
                ...state,
                brandSelect: Number(payload.dataValue),
                brandInput: brandString,
                title: `${brandString} `,
            };
        }

        case "brandInput": {
            return {
                ...state,
                brandSelect: 0,
                brandInput: payload.dataValue,
                //Does not populate " " if user clears the brandInput.
                title: `${payload.dataValue}${!payload.dataValue ? "" : " "}`,
            };
        }

        case "descriptionText": {
            const remainingCharacters = reducerInitialState.descriptionCharacterCount - dataValue.length;

            if (remainingCharacters <= -1) {
                return { ...state };
            } else {
                return {
                    ...state,
                    descriptionText: dataValue,
                    descriptionCharacterCount: remainingCharacters,
                };
            }
        }

        default: {
            return {
                ...state,
                [payload.dataPoint]: dataValue,
            };
        }
    }
};

function CreateListing() {
    // Ref
    const openGate = useRef(true);

    // State
    const [loading, setLoading] = useState(true);
    const [serverOptions, setServerOptions] = useState<ServerOptionsObject>();
    const [subcategories, setSubcategories] = useState<Array<SubcategoryObject>>([]);
    const [validInputs, setValidInputs] = useState<Array<ValidDataPoint>>(config.requiredState.map((item) => {
        return { dataPoint: item, valid: true }
    }));

    // Reducer
    const [state, dispatch] = useReducer(reducer, reducerInitialState);

    //   const history = useHistory();

    useEffect(() => {
        if (!openGate.current) return;
        openGate.current = false;
        getServerOptions();
    });

    const getServerOptions = async () => {
        try {
            const r = await gql(`{ 
            categories { id, category }
            deliveryTypes { id, deliveryType }
            brands { id, brandName }
            itemConditions { id, itemConditionName }
            }`);

            // Define array of [Brands] outside of component
            // for Reducer scope.
            config.databaseLists.brands = r.brands;

            // {serverOptions} populates <select> elements.
            // subcategory is populated later dynamically.
            setServerOptions({
                deliveryTypes: r.deliveryTypes,
                brands: r.brands,
                categories: r.categories,
                itemConditions: r.itemConditions,
            });

            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchSubcategory = async (categoryId: number) => {
        const r: SubCategoryArray = await gql(`{ subcategories (categoryId: ${Number(categoryId)}) { id, subcategory } }`);
        const subcategories = r.subcategories.sort((a, b) => {
            if (a.subcategory > b.subcategory) return 1;
            if (a.subcategory < b.subcategory) return -1;
            return 0;
        });

        setSubcategories(subcategories);
    };

    const sendGoodToDB = async () => {
        const brandId: number = await checkBrand();
        const productTitle = state.title.replaceAll("  ", " ");
        const removeCarriageReturns = state.descriptionText.replace(RegExp(String.fromCharCode(10), "g"), "/n");

        // Add product to goods table.
        try {
            const mutation = `mutation { newGood( 
            jwt: "${localStorage.getItem("jwt")}", 
            price: ${Number(state.price) * 100}, 
            itemCondition: ${Number(state.itemCondition)},  
            title: "${productTitle}",  
            brand: ${brandId}, 
            descriptionText: "${removeCarriageReturns ?? null}",
            categoryId: ${Number(state.categoryId)}, 
            subcategoryId: ${Number(state.subcategoryId)} 
            quantity: ${Number(state.quantity)}, 
            deliveryId: ${Number(state.deliveryId)} )
          { insertId } }`;
            console.info(mutation);
            const { newGood } = await gql(mutation);

            if (newGood.insertId) {
                console.info(newGood.insertId);
                // history.push(`/product-${newGood.insertId}?success=true`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const checkBrand = async () => {
        if (state.brandSelect) return state.brandSelect;

        const foundId = config.databaseLists.brands.find((item) => item.brandName === state.brandInput);
        if (foundId) return foundId.id;

        // Unrecognised Brand. Send new brand to DB, then return insertId.
        const newBrandId: number = await sendNewBrand(state.brandInput);
        return newBrandId;
    };

    // Insert new brand, send returned id to sendGoodToDB().
    const sendNewBrand = async (newBrandFromInput: string) => {
        try {
            const { newBrand } = await gql(`mutation { newBrand (brandName: "${newBrandFromInput}") { insertId } }`);
            return (newBrand) ? newBrand.insertId : -1;
        } catch (e) {
            console.error(e);
        }
    };

    const handleClearTitle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch({ dataPoint: "title", dataValue: "" });
    };

    const clickSubmitProduct = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (validateInputs()) sendGoodToDB();
    };

    const validateInputs = () => {
        const validInputList = config.requiredState.map((item) => {
            return { dataPoint: item, valid: true }
        });

        config.requiredState.forEach((item, index) => {
            const keyFix = item as keyof StateObject;
            if (!!state[keyFix] === false) validInputList[index].valid = false;
        });

        const allInputsAreValid = !validInputList.some((item) => item.valid === false);
        if (!allInputsAreValid) setValidInputs(validInputList);

        return allInputsAreValid;
    };

    const resetDataPointValidity = (dataPoint: string) => {
        const tempValidInputs = [...validInputs];
        const dataPointIndex = tempValidInputs.findIndex(item => item.dataPoint === dataPoint);

        if (dataPointIndex === -1) return validInputs;

        tempValidInputs[dataPointIndex].valid = true;
        return tempValidInputs;
    }

    const handleInputReducer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const dataPoint = target.dataset.point!;
        const dataValue = target.value;

        // Reset changed valid state
        setValidInputs(resetDataPointValidity(dataPoint));

        dispatch({ dataPoint, dataValue });
        if (dataPoint === "categoryId") fetchSubcategory(Number(dataValue));
    };

    const handleSelectReducer = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;
        const dataPoint = target.dataset.point!;
        const dataValue = target.value;

        // Reset changed valid state with special case for "brandSelect".
        setValidInputs(resetDataPointValidity(dataPoint === "brandSelect" ? "brandInput" : dataPoint));

        dispatch({ dataPoint, dataValue });
        if (dataPoint === "categoryId") fetchSubcategory(Number(dataValue));
    };

    const handleTextAreaReducer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const target = e.target as HTMLTextAreaElement;
        const dataPoint = target.dataset.point!;
        const dataValue = target.value;

        // Reset changed valid state
        setValidInputs(resetDataPointValidity(dataPoint));

        dispatch({ dataPoint, dataValue });
        if (dataPoint === "categoryId") fetchSubcategory(Number(dataValue));
    };

    if (loading === true) return <>Loading</>;

    return (
        <>
            <form className={styles.container}>
                <fieldset data-brand-box>
                    <legend>Brand</legend>
                    <label>
                        <span data-brand-instructions>Select a Brand from list or type in the field</span>
                        <span data-brand-inputs>
                            <select data-point="brandSelect" value={state.brandSelect} onChange={handleSelectReducer}>
                                <option value="0">Brands...</option>
                                {serverOptions?.brands?.map((brand: BrandObject) => (
                                    <option key={brand.brandName} data-brand-select={brand.brandName} value={brand.id}>
                                        {brand.brandName}
                                    </option>
                                ))}
                            </select>
                            <input placeholder="Brand Name" data-point="brandInput" list="brand-list" data-valid-alert={validInputs.find(item => item.dataPoint === "brandInput")?.valid} value={state.brandInput} onChange={handleInputReducer} />
                            <datalist id="brand-list">
                                {serverOptions?.brands?.map((brandOption: BrandObject) => (
                                    <option key={brandOption.brandName} data-brand-id={brandOption.id} value={brandOption.brandName}></option>
                                ))}
                            </datalist>
                        </span>
                    </label>
                </fieldset>

                <label>
                    Product Category:
                    <select data-point="categoryId" data-valid-alert={validInputs.find(item => item.dataPoint === "categoryId")?.valid} value={state.categoryId} onChange={handleSelectReducer}>
                        <option value="0">Please Select...</option>
                        {serverOptions?.categories?.map((category: CategoryObject) => (
                            <option key={category.category} value={category.id}>
                                {category.category}
                            </option>
                        ))}
                    </select>
                </label>

                <label data-visually-hidden={subcategories.length ? false : true}>
                    Sub-Category:
                    <select data-point="subcategoryId" value={state.subcategoryId} onChange={handleSelectReducer}>
                        <option value="0">Please Select...</option>
                        {subcategories?.map((subcategory) => (
                            <option key={subcategory.subcategory} value={subcategory.id}>
                                {subcategory.subcategory}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Item Condition:
                    <select data-point="itemCondition" data-valid-alert={validInputs.find(item => item.dataPoint === "itemCondition")?.valid} value={state.itemCondition} onChange={handleSelectReducer}>
                        <option value="0">Please Select...</option>
                        {serverOptions?.itemConditions?.map((condition: ItemConditionObject) => (
                            <option key={condition.itemConditionName} value={condition.id}>
                                {condition.itemConditionName}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Delivery Method:
                    <select data-point="deliveryId" data-valid-alert={validInputs.find(item => item.dataPoint === "deliveryId")?.valid} value={state.deliveryId} onChange={handleSelectReducer}>
                        <option value="0">Please Select...</option>
                        {serverOptions?.deliveryTypes?.map((type: DeliveryObject) => (
                            <option key={type.deliveryType} value={type.id}>
                                {type.deliveryType}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Product Title:
                    <input type="text" data-point="title" data-valid-alert={validInputs.find(item => item.dataPoint === "title")?.valid} value={state.title} onChange={handleInputReducer}></input>
                    <button onClick={handleClearTitle} aria-label="Erase Title Text">
                        X
                    </button>
                </label>

                <label>
                    Price in USD:
                    <input type="number" step="1" inputMode="numeric" data-point="price" value={state.price} onChange={handleInputReducer} />
                </label>

                <label>
                    Quantity:
                    <input type="number" step="1" inputMode="numeric" data-point="quantity" data-valid-alert={validInputs.find(item => item.dataPoint === "quantity")?.valid} value={state.quantity} onChange={handleInputReducer}></input>
                </label>

                <div>
                    <label>
                        Product Description
                        <textarea data-point="descriptionText" value={state.descriptionText} onChange={handleTextAreaReducer} />
                    </label>
                    <span>Characters Remaining: {state.descriptionCharacterCount} / 2000</span>
                </div>

                <button onClick={clickSubmitProduct}>
                    List Product
                </button>
            </form>

            {/* <dialog ref={modalRef}>
                <div>{message}</div>
                <button>List For Free</button>
                <button>No</button>
            </dialog> */}
        </>
    );
}

export default CreateListing;
