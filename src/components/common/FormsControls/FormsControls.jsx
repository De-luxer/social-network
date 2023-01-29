import React from "react";
import cont from "./FormsControls.module.css"

const FormControl = ({input, meta, child, ...props}) => {
    const hasErrror = meta.touched && meta.error;
    return (
        <div className={hasErrror ? cont.error : null}>
            {props.children}<br />
            {hasErrror && <span className={cont.error}>{meta.error}</span>}
        </div>
    );
}

export const Textarea = (props) => {
    const {input, meta, child, ...restprops} = props;
    return <FormControl {...props}><textarea {...input} {...restprops} /></FormControl>
}

export const Input = (props) => {
    const {input, meta, child, ...restprops} = props;
    return <FormControl {...props}><input {...input} {...restprops} /></FormControl>
}