import { FormAction, stopSubmit } from "redux-form";
import { ThunkAction } from "redux-thunk";
import { v1 } from "uuid";
import { authAPI, profileAPI, ResultCodeForCatcha, ResultCodesEnum, securityAPI, userAPI } from "../api/api";
import { PhotosType, ProfileType } from "../types/types";
import {actions as appActions} from "./app-reducer";
import { AppDispatch, AppStateType, InferActionsTypes } from "./redux-store";

let initialState = {
    id: null as number | null,
    email: null as string | null,
    login: null as string | null,
    isAuth: false as boolean,
    captchaUrl: null as string | null,
    profile: null as ProfileType | null,
    status: '' as string
};
export type InitialStateType = typeof initialState;

const authReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case "auth/SET_USER_DATA":
        case "auth/GET_CAPTCHA_URL_SUCCESS": 
            return {
                ...state,
                ...action.data,
            };
        case "auth/SET-USER-PROFILE":
            return {...state, profile: action.profile};
        case 'auth/SET_STATUS':
            return {...state, status: action.status};
        case 'auth/SAVE_PHOTO_SUCCESS':
            return {...state, profile: {...state.profile, photos: action.photos} as ProfileType};
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>;
export const actions = {
    setUserData: (id: number | null, email: string | null, login: string | null, isAuth: boolean, captchaUrl: string | null) => ({type: "auth/SET_USER_DATA", data: {id, email, login, isAuth, captchaUrl}} as const),
    getCaptchaUrlSuccess: (captchaUrl: string) => ({type: "auth/GET_CAPTCHA_URL_SUCCESS", data: {captchaUrl}} as const),
    setUserAuthProfile: (profile: ProfileType | null) => ({type: 'auth/SET-USER-PROFILE', profile} as const),
    setUserAuthStatus: (status: string) => ({type: 'auth/SET_STATUS', status} as const),
    savePhotoSuccess: (photos: PhotosType) => ({type: 'auth/SAVE_PHOTO_SUCCESS', photos} as const)
}

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getUserData = (): ThunkType => async (dispatch: AppDispatch) => {
    let meData = await authAPI.me();

    if (meData.resultCode === ResultCodesEnum.Succes) {
        let {id, email, login} = meData.data;
        dispatch(getUserAuthProfile(id));
        dispatch(getUserAuthStatus(id));
        dispatch(actions.setUserData(id, email, login, true, null));
    }
}

export const login = (email: string, password: string, rememberMe: boolean, captcha: string | null): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes | FormAction> => async (dispatch) => {
    const loginData = await authAPI.login(email, password, rememberMe, captcha);

    if (loginData.resultCode === ResultCodesEnum.Succes) {
        dispatch(getUserData());
    } else {
        if (loginData.resultCode === ResultCodeForCatcha.CaptchaIsRequired) {
            dispatch(getCaptchaUrl());
        }
        let message = loginData.messages.length > 0 ? loginData.messages[0] : "Some error";
        dispatch(stopSubmit("login", {_error: message}));
    }
}

export const getCaptchaUrl = (): ThunkType => async (dispatch: AppDispatch) => {
    try {
        const data = await securityAPI.getCaptchaUrl();
        const captchaUrl = data.url;
        dispatch(actions.getCaptchaUrlSuccess(captchaUrl));
    } catch (error) {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Error getting captcha for login: ${error}`, type: "error"}));
    }
}

export const logout = (): ThunkType => async (dispatch: AppDispatch) => {
    const response = await authAPI.logout();
    
    if (response.data.resultCode === ResultCodesEnum.Succes) {
        dispatch(appActions.stateCleaning());
        dispatch(appActions.initializedSuccess());
    } else {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Logout some error: ${response.data.messages[0]}`, type: "error"}));
    }
}

export const getUserAuthProfile = (userId: number): ThunkType => async (dispatch: AppDispatch) => {
    try {
        let data = await userAPI.getProfile(userId);
        dispatch(actions.setUserAuthProfile(data));
    } catch (error) {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Error getting user profile: ${error}`, type: "error"}));
    }
}

export const getUserAuthStatus = (userId: number): ThunkType => async (dispatch: AppDispatch) => {
    try {
        let data = await profileAPI.getStatus(userId);
        dispatch(actions.setUserAuthStatus(data));
    } catch (error) {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Error getting user status: ${error}`, type: "error"}));
    }
}

export const updateStatus = (status: string): ThunkType => async (dispatch: AppDispatch) => {
    let data = await profileAPI.updateStatus(status);
    if (data.resultCode === 0) {
        dispatch(actions.setUserAuthStatus(status));
        dispatch(appActions.addGlobalMessage({id: v1(), message: "Status updated!", type: "success"}));
    } else {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Error update user status: ${data.messages[0]}`, type: "error"}));
    }
}

export const savePhoto = (file: File): ThunkType => async (dispatch: AppDispatch) => {
    let data = await profileAPI.savePhoto(file);
    if (data.resultCode === 0) {
        dispatch(actions.savePhotoSuccess(data.data.photos));
        dispatch(appActions.addGlobalMessage({id: v1(), message: "Avatar updated!", type: "success"}));
    } else {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Error update user image: ${data.messages[0]}`, type: "error"}));
    }
}

export const saveProfile = (profile: ProfileType): ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes | FormAction> => async (dispatch: AppDispatch, getState) => {
    const userId = getState().auth.id;
    let data = await profileAPI.saveProfile(profile);
    if (data.resultCode === 0) {
        if (userId != null) {
            dispatch(getUserAuthProfile(userId));
            dispatch(appActions.addGlobalMessage({id: v1(), message: "Profile info updated!", type: "success"}));
        } else {
            dispatch(appActions.addGlobalMessage({id: v1(), message: `Error update user profile: userId = null, this should not be!`, type: "error"}));
        }
    } else {
        let message = data.messages.length > 0 ? data.messages[0] : "Some error";
        dispatch(stopSubmit("edit-profile", {_error: message}));
        return Promise.reject(message);
    }
}

export default authReducer;

//bankai