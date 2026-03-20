import { FormAction, stopSubmit } from 'redux-form';
import { ThunkAction } from 'redux-thunk';
import { profileAPI, userAPI } from '../api/api';
import { PhotosType, PostsDataType, ProfileType } from '../types/types';
import { AppStateType, InferActionsTypes } from './redux-store';

let initialState = {
    postsData: [
        { id: 1, message: 'Hi, how are you?', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
        { id: 2, message: 'Very nice', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
        { id: 3, message: 'It\'s good', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' }
    ] as Array<PostsDataType>,
    profile: null as ProfileType | null,
    status: '' as string,
    profileErrore: {isErrore: false as boolean, erroreMessage: "" as string}
};

export type InitialStateType = typeof initialState;
export type ProfileErroreType = typeof initialState.profileErrore;

const profileReducer = (state = initialState, action: ActionsTypes): InitialStateType => {

    switch(action.type) {
        case 'profile/ADD-POST':
            let newPost = {
                id: state.postsData.length + 1,
                message: action.newPostText,
                likes: 0,
                coments: 0,
                avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg'
            };
            return {
                ...state,
                postsData: [...state.postsData, newPost],
            };
        case 'profile/SET-USER-PROFILE':
            return {...state, profile: action.profile};
        case 'profile/SET_STATUS':
            return {
                ...state,
                status: action.status
            };
        case 'profile/DELETE_POST':
            return {...state, postsData: state.postsData.filter(p => p.id != action.PostId)};
        case 'profile/PROFILE-ERRORE':
            return {...state, profileErrore: action.payload}
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof actions>;
export const actions = {
    addPostActionCreator: (newPostText: string) => ({type: 'profile/ADD-POST', newPostText} as const),
    setUserProfile: (profile: ProfileType) => ({type: 'profile/SET-USER-PROFILE', profile} as const),
    setStatus: (status: string) => ({type: 'profile/SET_STATUS', status} as const),
    deletePost: (PostId: number) => ({type: 'profile/DELETE_POST', PostId} as const),
    setProfileErrore: (errore: ProfileErroreType) => ({type: 'profile/PROFILE-ERRORE', payload: errore} as const)
}

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>

export const getUsersProfile = (userId: number): ThunkType => async (dispatch) => {
    try {
        let data = await userAPI.getProfile(userId);
        dispatch(actions.setUserProfile(data));
        dispatch(actions.setProfileErrore({isErrore: false, erroreMessage: ""}))
    } catch (error) {
        dispatch(actions.setProfileErrore({isErrore: true, erroreMessage: "Error loading profile, maybe such profile does not exist"}))
    }

}

export const getStatus = (userId: number): ThunkType => async (dispatch) => {
    let data = await profileAPI.getStatus(userId);
    dispatch(actions.setStatus(data));
}

export default profileReducer;