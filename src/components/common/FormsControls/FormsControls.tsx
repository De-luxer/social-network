import React, {useState} from "react";
import { WrappedFieldInputProps, WrappedFieldMetaProps, WrappedFieldProps } from "redux-form";
import cont from "./FormsControls.module.css"
import { ReactComponent as PassEye } from "../../../assets/images/PassEye.svg"
import { ReactComponent as CheckMark } from "../../../assets/images/CheckMark.svg"

type FormControlPropsType = {
    meta: WrappedFieldMetaProps
    children: React.ReactNode
    input: WrappedFieldInputProps
}

const FormControl: React.FC<FormControlPropsType> = ({input, meta, children, ...props}) => {
    const [visible, setVisible] = useState(false);
    const hasErrror = meta.touched && meta.error;
    let isPasswordInput;
    let isCheckboxInput;
    // @ts-ignore
    if (children.props.name === "password") isPasswordInput = true;
    // @ts-ignore
    if (children.props.type === "checkbox") isCheckboxInput = true;
    const clonedChild = React.cloneElement(children as React.ReactElement, {type: visible ? "text" : "password"});
    return (
        <div className={`${cont.form_control_wrappper} ${hasErrror ? cont.error : null}`}>
            {isPasswordInput ? (
                <>
                    <div className={cont.password_container}>
                        {clonedChild}
                        <button className={cont.svg_btn} type="button" onClick={() => setVisible(v => !v)}><PassEye className={!visible ? cont.close_eye : null} /></button>
                    </div>
                    {hasErrror && <span className={cont.error}>{meta.error}</span>}
                </>
            ) : isCheckboxInput ? (
                <div className={cont.checkbox_wrapper}>
                    {children}
                    <span className={cont.check_mark_span}><CheckMark /></span>
                    <br/>
                    {hasErrror && <span className={cont.error}>{meta.error}</span>}
                </div>
            ) : (
                <>
                    {children}<br/>
                    {hasErrror && <span className={cont.error}>{meta.error}</span>}
                </>
            )}
        </div>
    );
}

export const Textarea: React.FC<WrappedFieldProps> = (props) => {
    const {input, meta, ...restprops} = props;
    return <FormControl {...props}><textarea {...input} {...restprops} /></FormControl>
}

export const Input: React.FC<WrappedFieldProps> = (props) => {
    const {input, meta, ...restprops} = props;
    return <FormControl {...props}><input {...input} {...restprops} /></FormControl>
}