import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AppStateType } from "../../redux/redux-store";
import { FilterType } from "../../redux/users-reducer";
import cont from "./../Users/Users.module.css";
import { Field, Form, Formik, useFormikContext } from "formik";
// @ts-ignore
import { debounce } from "lodash";
import "../../App.css";


type PropsType = {
    isFetching: boolean
    currentPage?: number
    onFilterChanged: (filter: FilterType) => void
}

const EffectFormInputUpdate = () => {
    const filter = useSelector((state: AppStateType) => state.friendsPage.filter);
    const { values, submitForm } = useFormikContext<{term: string}>();
    useEffect(() => {
        // если не будет проверки, то если поле не пустое и будет нажата кнопка Reset filter отправится два запроса на сервер вместо одного
        if (values.term !== filter.term) {
            submitForm();
        }
    }, [values, submitForm]);
    return null;
}

const FriendsSearchForm: React.FC<PropsType> = React.memo((props) => {
    const filter = useSelector((state: AppStateType) => state.friendsPage.filter);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const prevTermRef = useRef(filter.term);
    // блокирует isInputFocusBlock при первой загрузки страницы. Если его нет, но страница будет загруженая с не пустым filter.term тогда будет срабатывать useEffect реагирущий на изменение filter.term и поле будет с фокусом с самого начала загрузки старницы
    const isInputFocusBlock = useRef(true);
    let timeoutId = useRef<any>(null);

    const debouncedFilterUpdate = debounce((term: any) => {
        isInputFocusBlock.current = false
        props.onFilterChanged({ ...filter, term });
    }, 600);

    useEffect(() => {
        if (isInputFocusBlock.current) {
            return;
        }
        const checkAndFocus = () => {
            if (inputRef.current && !inputRef.current?.disabled) {
                inputRef.current?.focus();
                prevTermRef.current = filter.term;
            } else {
                timeoutId.current = setTimeout(checkAndFocus, 50);
            }
        };
        if (prevTermRef.current !== filter.term) {
            checkAndFocus();
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId.current);
            }
        }
    }, [filter.term]);

    useEffect(() => {
        return () => {debouncedFilterUpdate.cancel()};
    }, []);

    return (
        <Formik enableReinitialize={true} initialValues={{ term: filter.term }} onSubmit={(values, actions) => {
            debouncedFilterUpdate(values.term);
            actions.setSubmitting(false);
            }}>
                {({ isSubmitting, values }) => (
                    <Form className={cont.form}>
                        <Field className={cont.formTextInput} type="text" name="term" placeholder="Search" disabled={props.isFetching} innerRef={(el: HTMLInputElement) => (inputRef.current = el)}  />
                        <button className="starting_btn_styles" type="button" disabled={isSubmitting || props.isFetching || values.term === ""} onClick={() => props.onFilterChanged({ term: "", friend: true })}>Reset filter</button>
                        <EffectFormInputUpdate />
                    </Form>
                )}
        </Formik>
    )
});

export default FriendsSearchForm;