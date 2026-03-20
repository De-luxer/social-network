import dialogsReducer from "./dialogs-reducer";
import profileReducer from "./profile-reducer";
import sidebarReducer from "./sidebar-reducer";

let store = {
    _state: {
        profilePage: {
            postsData: [
                { id: 1, message: 'Hi, how are you?', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
                { id: 2, message: 'Very nice', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' },
                { id: 3, message: 'It\'s good', likes: 10, coments: 3, avatar: 'https://static.vecteezy.com/packs/media/components/global/search-explore-nav/img/vectors/term-bg-1-666de2d941529c25aa511dc18d727160.jpg' }
            ],
            newPostText: ''
        },
        dialogsPage: {
            usersData: [
                {id: 1, name:'Koly', avatar:'https://stihi.ru/pics/2012/11/12/2259.jpg'},
                {id: 2, name:'Den', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'}
            ],
            messagesData: [
                {id:1, message:'Hi', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'},
                {id:2, message:'How are you?', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'},
                {id:3, message:'Go in Dota', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'}
            ],
            newMessageText: 'Donate please'
        },
        sidebar: {}
    },
    _callSubscriber() {
        console.log('...');
    },
    getState() {
        return this._state
    },
    subscribe(observer) {
        this._callSubscriber = observer;
    },
    dispatch(action) {
        this._state.profilePage = profileReducer(this._state.profilePage, action);
        this._state.dialogsPage = dialogsReducer(this._state.dialogsPage, action);
        this._state.sidebar = sidebarReducer(this._state.sidebar, action);
        this._callSubscriber(this._state);
    },
}

export default store;
window.store = store;