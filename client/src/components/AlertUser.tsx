import React, { useContext, useEffect, useRef } from "react";
import { StoreContext } from "../globalContext/StoreContext";

import styles from "./AlertUser.module.scss";

function AlertUser() {
    // Context
    const { alertData, alertUser } = useContext(StoreContext);

    // Ref
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (alertData.alertType !== "off") modalRef.current?.showModal();
    })

    const closeModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        alertUser("off", ""); // Clear Alert.
        modalRef.current!.close();
    }

    if (alertData.alertType === "off") { return <></> } else {
        return (
            <dialog tabIndex={-1} ref={modalRef} aria-labelledby="dialog-message" className={styles.container} >
                <div data-wrapper>
                    <div id="dialog-message">
                        {alertData.message}
                    </div>
                    <button onClick={closeModal}>Close</button>
                </div>
            </dialog>
        );
    }
}

export default AlertUser;
