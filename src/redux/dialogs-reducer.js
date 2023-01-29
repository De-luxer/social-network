const ADD_MESSAGE = 'dialogs/ADD-MESSAGE';

let initialState = {
    usersData: [
        {id: 1, name:'Koly', avatar:'https://stihi.ru/pics/2012/11/12/2259.jpg'},
        {id: 2, name:'Den', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'}
    ],
    messagesData: [
        {id:1, message:'Hi', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'},
        {id:2, message:'How are you?', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'},
        {id:3, message:'Go in Dota', avatar:'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'}
    ]
};

const dialogsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_MESSAGE:
            let newMessage = {
                id: state.messagesData.length + 1,
                message: action.newMessageElement,
                avatar: 'https://amiel.club/uploads/posts/2022-03/1647664150_56-amiel-club-p-malish-yoda-kartinki-61.jpg'
            };
            //let body = action.newMessageText;
            return {
                ...state,
                messagesData: [...state.messagesData, newMessage],
            };
        default:
            return state;
    }
}

export const addMessageActionCreator = (newMessageElement) => ({type: ADD_MESSAGE, newMessageElement});

export default dialogsReducer;