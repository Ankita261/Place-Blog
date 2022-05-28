import React from "react";

import Modal from './Modal'
import Button from "../FormElements/Button";

const errorModal = props => {
    return (
        <Modal
            onCancel = {props.clear}
            header= "An error occured!"
            show = {!!props.error}
            footer = {<Button onClick = {props.onClear}>Okay</Button>}
            >
                <p>{props.error}</p>
            </Modal>
    );
};

export default errorModal;