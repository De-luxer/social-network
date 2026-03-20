import { Dispatch } from "redux";
import { ThunkAction } from "redux-thunk";
import { userAPI } from "../api/api";
import { UsersType } from "../types/types";
import { updateObjectInArray } from "../utils/object-helpers";
import { action as friendsActions } from "./friends-reducer";
import { AppStateType, InferActionsTypes } from "./redux-store";
import {actions as appActions} from "./app-reducer";
import { v1 } from "uuid";

let initialState = {
    users: [] as Array<UsersType>,
    pageSize: 10 as number,
    totalUsersCount: 0 as number,
    currentPage: 1 as number,
    isFetching: true as boolean,
    followingInProgress: [] as Array<number>, // arrray users IDs
    filter: {term: "" as string, friend: null as null | boolean}
};

export type InitialStateType = typeof initialState;
export type FilterType = typeof initialState.filter;

const usersReducer = (state = initialState, action: ActionsTypes): InitialStateType => {
    switch(action.type) {
        case "users/FOLLOW": 
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", {followed: true})
            }
        case "users/UNFOLLOW": 
            return {
                ...state,
                users: updateObjectInArray(state.users, action.userId, "id", {followed: false})
            }
        case "users/SET_USERS": {
            return {...state, users: action.users}
        }
        case "users/SET_CURENT_PAGE": {
            return {...state, currentPage: action.currentPage}
        }
        case "users/SET_TOTAL_USERS_COUNT": {
            return {...state, totalUsersCount: action.count}
        }
        case "users/TOGGLE_IS_FETCHING": {
            return {...state, isFetching: action.isFetching}
        }
        case "users/SET_FILTER": {
            return {...state, filter: action.payload}
        }
        case "users/TOGGLE_IS_FOLLOWING_PROGRESS": {
            return {
                ...state, 
                followingInProgress: action.isFetching
                ? [...state.followingInProgress, action.userId] 
                : state.followingInProgress.filter(id => id != action.userId)
            }
        }
        default:
            return state;
    }
}

type ActionsTypes = InferActionsTypes<typeof action>;

export const action = {
    followSuccess: (userId: number) => ({type: "users/FOLLOW", userId} as const),
    unfollowSuccess: (userId: number) => ({type: "users/UNFOLLOW", userId} as const),
    setUsers: (users: Array<UsersType>) => ({type: "users/SET_USERS", users} as const),
    setCurrentPage: (currentPage: number) => ({type: "users/SET_CURENT_PAGE", currentPage} as const),
    setFilter: (filter: FilterType) => ({type: "users/SET_FILTER", payload: filter} as const),
    setTotalUsersCount: (totalUsersCount: number) => ({type: "users/SET_TOTAL_USERS_COUNT", count: totalUsersCount} as const),
    toggleIsFetching: (isFetching: boolean) => ({type: "users/TOGGLE_IS_FETCHING", isFetching} as const),
    toggleFollowingProgress: (isFetching: boolean, userId: number) => ({type: "users/TOGGLE_IS_FOLLOWING_PROGRESS", isFetching, userId} as const),
}

type ThunkType = ThunkAction<Promise<void>, AppStateType, unknown, ActionsTypes>;

export const getUsers = (currentPage: number, pageSize: number, filter: FilterType): ThunkType => {
    return async (dispatch: Dispatch<any>) => {
        dispatch(action.toggleIsFetching(true));
        dispatch(action.setCurrentPage(currentPage));
        dispatch(action.setFilter(filter));
        let data = await userAPI.getUsers(currentPage, pageSize, filter.term, filter.friend);
        if (!data.error) {
            dispatch(action.toggleIsFetching(false));
            dispatch(action.setUsers(data.items));
            dispatch(action.setTotalUsersCount(data.totalCount));
        } else {
            dispatch(appActions.addGlobalMessage({id: v1(), message: `Error getting users: ${data.error}`, type: "error"}));
            dispatch(action.toggleIsFetching(false));
        }

    }
}

const _followUnfollowFlow = async (dispatch: Dispatch<any>, userId: number, apiMethod: any, actionCreator: (userId: number) => ActionsTypes) => {
    dispatch(action.toggleFollowingProgress(true, userId));
    let response = await apiMethod(userId);

    if (response.resultCode == 0) {
        dispatch(actionCreator(userId));
        dispatch(friendsActions.setFriends([], true));
    } else {
        dispatch(appActions.addGlobalMessage({id: v1(), message: `Follow/Unfollow error: ${response.messages[0]}`, type: "error"}));
    }
    dispatch(action.toggleFollowingProgress(false, userId));
}

export const follow = (userId: number): ThunkType => {
    return async (dispatch) => {
        await _followUnfollowFlow(dispatch, userId, userAPI.follow.bind(userAPI), action.followSuccess);
    }
}
export const unfollow = (userId: number): ThunkType => {
    return async (dispatch) => {
        await _followUnfollowFlow(dispatch, userId, userAPI.unfollow.bind(userAPI), action.unfollowSuccess);
    }
}

export default usersReducer;