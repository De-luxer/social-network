import { DialogsType, MessageType } from '../types/types';
import { InferActionsTypes } from './redux-store';

let initialState = {
    usersData: [
        {id: 1, name:'Koly', avatar:'https://stihi.ru/pics/2012/11/12/2259.jpg'},
        {id: 2, name:'Den', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'}
    ] as Array<DialogsType>,
    messagesData: [
        {id:1, message:'Hi', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'},
        {id:2, message:'How are you?', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'},
        {id:3, message:'Go in Dota', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'}
    ] as Array<MessageType>
};

export type InitialStateType = typeof initialState;

const dialogsReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case 'dialogs/ADD-MESSAGE':
            let newMessage = {
                id: state.messagesData.length + 1,
                message: action.newMessageElement,
                avatar: 'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'
            };
            return {
                ...state,
                messagesData: [...state.messagesData, newMessage],
            };
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>;
export const actions = {
    addMessageActionCreator: (newMessageElement: string) => ({type: 'dialogs/ADD-MESSAGE', newMessageElement} as const)
}

export default dialogsReducer;