import { AppStateType } from "./redux-store";

export const selectorIsAuth = (state: AppStateType) => {
    return state.auth.isAuth;
}

export const selectorAuthUserLogin = (state: AppStateType) => {
    return state.auth.login;
}

export const selectorAuthUserSmallAvatar = (state: AppStateType) => {
    return state.auth.profile?.photos.small;
}