import React, { useEffect, useRef, useState } from "react";

import styles from "./AlertUser.module.scss";

export const sendAlert = (messageType: "danger" | "info" = "info", message: string) => {
    const messageObject = {
        messageOrigin: "sendAlert",
        messageType,
        message
    }
    window.postMessage(messageObject, "*");
}

function AlertUser() {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [messageType, setMessageType] = useState<"danger" | "info">("info");
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    });

    const handleMessage = (e: MessageEvent) => {
        if (e.data.messageOrigin !== "sendAlert") return;

        const messageType: "danger" | "info" = e.data.messageType;
        const message: string = e.data.message;

        setMessageType(messageType);
        setMessage(message);
        modalRef.current?.showModal();
    }

    const closeModal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setMessage("");
        modalRef.current!.close();
    }

    return (
        <dialog tabIndex={-1} ref={modalRef} aria-labelledby="dialog-message" data-message-type={messageType} className={styles.container} >
            <div data-wrapper>
                <div id="dialog-message">
                    {message}
                </div>
                <button onClick={closeModal}>Close</button>
            </div>
        </dialog>
    );
}

export default AlertUser;
