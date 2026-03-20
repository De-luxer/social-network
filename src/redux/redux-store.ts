import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { reducer as formReducer } from 'redux-form'
import thunkMiddleware from 'redux-thunk';
import sidebarReducer from './sidebar-reducer';
import profileReducer from './profile-reducer';
import dialogsReducer from './dialogs-reducer';
import usersReducer from './users-reducer'
import authReducer from './auth-reducer';
import appReducer from './app-reducer';
import chatReducer from './chat-reducer';
import friendsReducer from './friends-reducer';

let rootCombineReducer = combineReducers({
    sidebar: sidebarReducer,
    profilePage: profileReducer,
    dialogsPage: dialogsReducer,
    usersPage: usersReducer,
    auth: authReducer,
    form: formReducer,
    app: appReducer,
    chat: chatReducer,
    friendsPage: friendsReducer
});

const rootReducer = (state: ReturnType<typeof rootCombineReducer> | undefined, action: any) => {
    if (action.type === "root/LOGOUT") {
        state = undefined;
    }
    return rootCombineReducer(state, action);
};

type RootReducersType = typeof rootCombineReducer;
export type AppStateType = ReturnType<RootReducersType>;

export type InferActionsTypes<T> = T extends {[keys: string]: (...args: any) => infer U} ? U : never;

// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunkMiddleware)
));
export type AppDispatch = typeof store.dispatch;

//Был изначально
//let store = createStore(reducers, applyMiddleware(thunkMiddleware));
// @ts-ignore
window.__store__ = store;

export default store;