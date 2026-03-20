import React, { useEffect } from "react";
import cont from "./Login.module.css";
import formStyle from "../common/FormsControls/FormsControls.module.css"
import { useDispatch, useSelector } from "react-redux";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { maxLengthCreator, required } from "../../utils/validators/validators";
import { Input } from "../common/FormsControls/FormsControls";
import { login } from "../../redux/auth-reducer"
import { actions as appActions } from "../../redux/app-reducer"
import { Navigate } from "react-router-dom";
import { AppStateType } from "../../redux/redux-store";

//const maxLength60 = maxLengthCreator(60);

const LoginForm: React.FC<InjectedFormProps<LoginFormValuesType, OwnPropsType> & OwnPropsType> = ({handleSubmit, error, captchaUrl}) => {
    return (
        <form onSubmit={handleSubmit} className={formStyle.auth_form}>
            <div className={formStyle.auth_input_container}>
                <label htmlFor="email">Email</label>
                <div className={formStyle.auth_input}>
                    <Field id="email" placeholder="Enter email" component={Input} name={"email"} validate={[required]} />
                </div>
            </div>
            <div className={formStyle.auth_input_container}>
                <label htmlFor="pass">Password</label>
                <div className={formStyle.auth_input}>
                    <Field id="pass" placeholder="Enter password" component={Input} name={"password"} validate={[required]} type={"password"} />
                </div>
            </div>
            <div className={formStyle.auth_checkbox_container}>
                <label htmlFor="remMe">
                    <div className={formStyle.auth_input}>
                        <Field id="remMe" type={"checkbox"} component={Input} name={"rememberMe"}/>
                    </div>
                    Remember me
                </label>
            </div>
            {error ? <div className={formStyle.errorRrr}>
                    {error}
                </div> : null
            }
            {captchaUrl ? <img src={captchaUrl}  alt={"Login captcha"} /> : null}
            {captchaUrl ? <Field component={Input} name={"captcha"} validate={[required]}/> : null}
            <div>
                <button className={formStyle.send_auth_btn}>Login</button>
            </div>
        </form>
    );
}

const LoginReduxForm = reduxForm<LoginFormValuesType, OwnPropsType>({
    form: 'login'
})(LoginForm)

type OwnPropsType = {
    captchaUrl: string | null
}
type LoginFormValuesType = {
    email: string
    password: string
    rememberMe: boolean
    captcha: string | null
}

const Login: React.FC = () => {
    const captchaUrl = useSelector((state: AppStateType) => state.auth.captchaUrl);
    const isAuth = useSelector((state: AppStateType) => state.auth.isAuth);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(appActions.stateCleaning());
        dispatch(appActions.initializedSuccess());
    }, []);

    const onSubmit = (formData: LoginFormValuesType) => {
        dispatch(login(formData.email, formData.password, formData.rememberMe, formData.captcha));
    }

    if (isAuth) {
        return <Navigate to={"/profile"} />
    } else {
        return (
            <div>
                <h1>Login</h1>
                <LoginReduxForm onSubmit={onSubmit} captchaUrl={captchaUrl} />
            </div>
        );
    }
}

export default Login;