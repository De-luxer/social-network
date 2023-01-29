const ADD_MESSAGE = 'dialogs/ADD-MESSAGE';

let initialState = {
    usersData: [
        {id: 1, name:'Koly', avatar:'https://stihi.ru/pics/2012/11/12/2259.jpg'},
        {id: 2, name:'Den', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'}
    ],
    messagesData: [
        {id:1, message:'Hi', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'},
        {id:2, message:'How are you?', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'},
        {id:3, message:'Go in Dota', avatar:'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'}
    ]
};

const dialogsReducer = (state = initialState, action) => {
    switch(action.type) {
        case ADD_MESSAGE:
            let newMessage = {
                id: state.messagesData.length + 1,
                message: action.newMessageElement,
                avatar: 'https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg'
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