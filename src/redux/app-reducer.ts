import { ThunkAction } from "redux-thunk";
import { GlobalMessagesType } from "../types/types";
import { getUserData } from "./auth-reducer";
import { AppStateType, InferActionsTypes } from "./redux-store";

let initialState = {
    initialized: false as boolean,
    messages: [] as GlobalMessagesType[]
};

export type InitialStateType = typeof initialState;

const appReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case "app/INITIALIZED_SUCCESS": 
            return {
                ...state,
                initialized: true
            };
        case "app/ADD_GLOBAL_MESSAGE":
            return {...state, messages: [...state.messages, action.payload]};
        case "app/DELETE_GLOBAL_MESSAGE":
            return {...state, messages: state.messages.filter(m => m.id !== action.id)};
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>;
export const actions = {
    initializedSuccess: () => ({type: "app/INITIALIZED_SUCCESS"} as const),
    addGlobalMessage: (message: GlobalMessagesType) => ({type: "app/ADD_GLOBAL_MESSAGE", payload: message} as const),
    deleteGlobalMessage: (id: string) => ({type: 'app/DELETE_GLOBAL_MESSAGE', id} as const),
    stateCleaning: () => ({ type: 'root/LOGOUT' } as const)
}

type ThunkType = ThunkAction<Promise<void> | void, AppStateType, unknown, ActionsTypes>;

export const initializeApp = (): ThunkType => (dispatch) => {
    let promise = dispatch(getUserData());
    promise.then(() => {
        dispatch(actions.initializedSuccess());
    });
}

export default appReducer;