import React, {useRef, useState} from "react";
import { Formik, Form, Field } from "formik";
import formStyle from "../../components/common/FormsControls/FormsControls.module.css";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchSvg } from "../../assets/images/Search.svg";
import { ReactComponent as XSvg } from "../../assets/images/X.svg";

type FormType = {
    term: string
}

const HeaderSearchForm: React.FC = React.memo(() => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const [active, setActive] = useState(false);
    const submit = (values: FormType, { setSubmitting }: {setSubmitting: (isSubmitting: boolean) => void}) => {
        setSubmitting(false);
        navigate(`/users?term=${values.term}`);
    }
    
    return <Formik onSubmit={submit} initialValues={{term: ''}}>
        {({ isSubmitting, values, setFieldValue}) => (
            <Form className={formStyle.search_auth_form}>
                <label className={formStyle.label_container}>
                    <Field type="text" name="term" innerRef={inputRef} placeholder="Search for Samurai" />
                    <div className={`${formStyle.btn_wrapper} ${values.term !== "" ? formStyle.visible : null}`}>
                        <button className={`${formStyle.svg_btn} ${formStyle.svg_btn_x} ${active ? formStyle.active : null}`} type="button" onClick={() => {setFieldValue("term", ""); inputRef.current?.focus(); setActive(a => !a)}} disabled={values.term === ""}><XSvg /></button>
                        <button className={`${formStyle.svg_btn} ${formStyle.search_btn}`} type="submit" disabled={isSubmitting || values.term === ""}><SearchSvg /></button>
                    </div>
                </label>
            </Form>
        )}
    </Formik>
});

export default HeaderSearchForm;