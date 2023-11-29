import React, { useEffect, useState, useReducer } from "react";

import styles from "./Specifications.module.scss";

import { subcategories } from "./specificationsData";

export interface SubcategoryObject {
    subcategoryId: number
    subcategoryName: string
    specs: Array<SubcategorySpec>
}

interface SubcategorySpec {
    name: string,
    specType: "input" | "select",
    options?: SpecOptions,
    values?: Array<SpecValue>
}

interface SpecOptions {
    inputType?: "text" | "number"
}

interface SpecValue {
    name: string,
    value: number | string
}

const removeSpaces = (string: string) => string.replaceAll(" ", "");
const lowerCaseFirstCharacter = (string: string) => string.charAt(0).toLowerCase() + string.slice(1);
const sanitizeDataPoint = (dataPoint: string) => removeSpaces(lowerCaseFirstCharacter(dataPoint));

const reducer = (state: any, payload: { dataPoint: string, dataValue: string }): any => {
    return {
        ...state,
        [sanitizeDataPoint(payload.dataPoint)]: payload.dataValue
    }
}

function Specifications({ propsSubId, specificationsSignal }: { propsSubId: number, specificationsSignal: any }) {
    const [subcategoryInfo, setSubcategoryInfo] = useState<SubcategoryObject>();

    // Reducer
    const [state, dispatch] = useReducer(reducer, {});

    // Push state to <CreateListing />.
    useEffect(() => {
        specificationsSignal(state);
    }, [state, specificationsSignal]);

    useEffect(() => {
        const currentSubCategory = subcategories.find((item) => item.subcategoryId === Number(propsSubId));
        setSubcategoryInfo(currentSubCategory);
    }, [propsSubId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target;
        const dataPoint = target.dataset.point!;
        const dataValue = target.value;

        dispatch({ dataPoint, dataValue });
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const target = e.target;
        const dataPoint = target.dataset.point!;
        const dataValue = target.value;

        dispatch({ dataPoint, dataValue });
    }

    const readState = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        console.info(state);
    }

    return (
        <section aria-label="Product Specifications" className={styles.container} >
            Subcategory ID: {propsSubId}
            <label>
                Color
                <input type="text" data-point="productColor" value={state["productColor"] || ""} onChange={handleInputChange} />
            </label>
            <label>
                Material
                <input type="text" data-point="productMaterial" value={state["productMaterial"] || ""} onChange={handleInputChange} />
            </label>
            <label>
                Weight
                <input type="number" data-point="productWeight" value={state["productWeight"] || ""} onChange={handleInputChange} />
            </label>
            {subcategoryInfo && Object.values(subcategoryInfo?.specs!).map((spec, index) => (
                <label key={spec.name}>
                    {spec.name}
                    {spec.specType === "input" &&
                        <input type={spec.options?.inputType || "text"} data-point={spec.name} value={state[sanitizeDataPoint(spec.name)] || ""} onChange={handleInputChange} />
                    }
                    {spec.specType === "select" &&
                        <select data-point={spec.name} value={state[sanitizeDataPoint(spec.name)] || ""} onChange={handleSelectChange}>
                            <option value="null">Please Select...</option>
                            {spec.values?.map((option) => (
                                <option key={option.name} value={option.value}>{option.name}</option>
                            ))}
                        </select>
                    }
                </label>
            ))}
            <button onClick={readState}>Read State</button>
        </section>
    );
}


export default Specifications;
