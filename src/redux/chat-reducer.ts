import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { ChatAPI } from "../api/api";
import { ChatMessageType, StatusType } from "../types/types";
import { AppStateType, InferActionsTypes } from "./redux-store";
import {v1} from "uuid";

export type ChatMessageIdType = ChatMessageType & {id: string};

let initialState = {
    messages: [] as ChatMessageIdType[],
    status: "pending" as StatusType,
    isFetching: true as boolean
};
export type InitialStateType = typeof initialState;

const chatReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case "chat/MESSAGES_RECEIVED": 
            return {
                ...state,
                messages: [...state.messages, ...action.data.messages.map(m => ({...m, id: v1()}))].filter((m, index, array) => index >= array.length - 88)
            };
        case "chat/STATUS_CHANGED": 
            return {
                ...state,
                status: action.data.status
            };
        case "chat/STATUS_CLEARED":
            return {
                ...state,
                messages: action.data.messages
            };
        case "chat/TOGGLE_IS_FETCHING": {
            return {...state, isFetching: action.isFetching}
        }
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>;
export const actions = {
    messagesReceived: (messages: ChatMessageType[]) => ({type: "chat/MESSAGES_RECEIVED", data: {messages}} as const),
    statusChanged: (status: StatusType) => ({type: "chat/STATUS_CHANGED", data: {status}} as const),
    messagesCleared: (messages: ChatMessageIdType[]) => ({type: "chat/STATUS_CLEARED", data: {messages}} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: "chat/TOGGLE_IS_FETCHING", isFetching} as const)
}

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

let _newMessageHandler: ((messages: ChatMessageType[]) => void) | null = null;
const newMessageHandler = (dispatch: Dispatch) => {
    if(_newMessageHandler === null) {
        _newMessageHandler = (messages) => {
            dispatch(actions.toggleIsFetching(false));
            dispatch(actions.messagesReceived(messages));
        }
    }
    return _newMessageHandler;
}

let _statusChangedHandler: ((status: StatusType) => void) | null = null;
const statusChangedHandler = (dispatch: Dispatch) => {
    if(_statusChangedHandler === null) {
        _statusChangedHandler = (status) => {
            dispatch(actions.statusChanged(status));
        }
    }
    return _statusChangedHandler;
}

export const startMessagesListening = (): ThunkType => async (dispatch) => {
    dispatch(actions.toggleIsFetching(true));
    ChatAPI.start();
    ChatAPI.subscribe("message-received", newMessageHandler(dispatch));
    ChatAPI.subscribe("status-changed", statusChangedHandler(dispatch));
}

export const stopMessagesListening = (messages: ChatMessageIdType[]): ThunkType => async (dispatch) => {
    ChatAPI.unsubscribe("message-received", newMessageHandler(dispatch));
    ChatAPI.unsubscribe("status-changed", statusChangedHandler(dispatch));
    ChatAPI.stop();
    dispatch(actions.messagesCleared(messages));
}

export const sendMessage = (message: string): ThunkType => async (dispatch) => {
    ChatAPI.sendMessage(message);
}

export default chatReducer;

//bankai