import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";
import { AppStateType } from "../../redux/redux-store";

let mapStateToPropsForRedirect = (state: AppStateType) => ({
    isAuth: state.auth.isAuth
});


type StatePropsType = ReturnType<typeof mapStateToPropsForRedirect>;

export function withAuthRedirect (Component: React.ComponentType<StatePropsType>) {
    function RedirectComponent(props: StatePropsType) {
        if (!props.isAuth) return <Navigate to={'/login'} />
        return <Component {...props} />
    }
    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent);
    return ConnectedAuthRedirectComponent;
}