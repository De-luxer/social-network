import React from "react";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { maxLengthCreator, required } from "../../utils/validators/validators";
import { Input } from "../common/FormsControls/FormsControls";
import { login } from "../../redux/auth-reducer"
import { Navigate } from "react-router-dom";
import cont from "../common/FormsControls/FormsControls.module.css"

const maxLength60 = maxLengthCreator(60);

const LoginForm = ({handleSubmit, error}) => {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <Field placeholder="Email" component={Input} name={"email"} validate={[required, maxLength60]} />
            </div>
            <div>
                <Field placeholder="Password" component={Input}  name={"password"} validate={[required, maxLength60]} type={"password"} />
            </div>
            <div>
                <Field type={"checkbox"} component={Input} name={"rememberMe"}/> remember me
            </div>
            {error ? <div className={cont.errorRrr}>
                    {error}
                </div> : null
            }
            <div>
                <button>Login</button>
            </div>
        </form>
    );
}

const LoginReduxForm = reduxForm({
    form: 'login'
})(LoginForm)

const Login = (props) => {
    const onSubmit = (formData) => {
        props.login(formData.email, formData.password, formData.rememberMe);
    }

    if (props.isAuth) {
        return <Navigate to={"/profile"} />
    } else {
        return (
            <div>
                <h1>Login</h1>
                <LoginReduxForm onSubmit={onSubmit} />
            </div>
        );
    }
}

let mapStateToProps = (state) => {
    return {
        isAuth: state.auth.isAuth
    }
}

export default connect(mapStateToProps, {login})(Login);