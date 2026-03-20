import React from 'react';
import { Formik, Form, Field } from 'formik';
import { FilterType } from '../../redux/users-reducer';
import { useSelector } from 'react-redux';
import { getFilter } from '../../redux/users-selectors';
import cont from './Users.module.css';
import "../../App.css";

const usersSearchValidateForm = (values: any) => {
    const errors = {};
    return errors;
}

type FriendType = 'null' | 'true' | 'false';
type FormType = {
    term: string,
    friend: FriendType
}

type PropsType = {
    isFetching: boolean
    currentPage?: number
    isAuth: boolean

    onFilterChanged: (filter: FilterType) => void
    onPageChanged: (page: number, filter: FilterType) => void
    onResetForm?: (resetForm: () => void) => void;
}

const UsersSearchForm: React.FC<PropsType> = React.memo((props) => {
    const filter = useSelector(getFilter);

    const submit = (values: FormType, { setSubmitting }: {setSubmitting: (isSubmitting: boolean) => void}) => {
        const filter: FilterType = {
            term: values.term,
            friend: values.friend === 'null' ? null : values.friend === 'true' ? true : false
        }
        props.onFilterChanged(filter);
        setSubmitting(false);
    }
    
    return <div>
        <Formik
            enableReinitialize={true}
            initialValues={{ term: filter.term, friend: String(filter.friend) as FriendType }}
            validate={usersSearchValidateForm}
            onSubmit={submit}
        >
            {({ isSubmitting, values, resetForm }) => {
                props.onResetForm?.(resetForm);
                return (
                    <Form className={cont.form}>
                        <Field className={cont.formTextInput} type="text" name="term" />
                        {props.isAuth && <Field className={cont.formTextInput} name="friend" as="select">
                            <option value="null">All</option>
                            <option value="true">Followed</option>
                            <option value="false">Unfollowed</option>
                        </Field>}
                        <button className={`${cont.submitButton} starting_btn_styles`} type="submit" disabled={isSubmitting || props.isFetching || (values.term === "" && values.friend === "null") || (values.term === filter.term && values.friend === String(filter.friend))}>Find</button>
                        <button className="starting_btn_styles" type="button" disabled={isSubmitting || props.isFetching || (filter.term === "" && filter.friend === null && props.currentPage === 1)} onClick={() => {props.onFilterChanged({term: "", friend: null}); resetForm();}}>Reset filter</button>
                    </Form>
                )
            }}
        </Formik>
    </div>
});

export default UsersSearchForm;