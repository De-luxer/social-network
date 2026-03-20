import React from 'react';
import cont from './Dialogs.module.css';
import User from './User/User';
import Message from './Message/Message';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { Textarea } from '../common/FormsControls/FormsControls';
import { maxLengthCreator, required } from '../../utils/validators/validators';
import { InitialStateType } from '../../redux/dialogs-reducer';

type PropsType = {
    dialogsPage: InitialStateType
    addMessage: (newMessageElement: string) => void
}

type NewMessageFormType = {
    newMessageElement: string
}

const Dialogs: React.FC<PropsType> = (props) => {

    let dialogsUsers = props.dialogsPage.usersData.map( users =>  <User key={users.id} name={users.name} avatar={users.avatar} id={users.id} />  );

    let dialogsMessages = props.dialogsPage.messagesData.map( messages =>  <Message key={messages.id} message={messages.message} avatar={messages.avatar} id={messages.id} />  );

    let addNewMessage = (values: NewMessageFormType) => {
        props.addMessage(values.newMessageElement);
    }

    return (
        <div>
            <h4>Messages</h4>
            <div className={cont.dialogs}>
                <div className={cont.dialogs_item}>
                    {dialogsUsers}
                </div>
                <div className={cont.dialogs_item}>
                    {dialogsMessages}
                    <AddMessageFormRedux onSubmit={addNewMessage} dialogsPage={props.dialogsPage} addMessage={props.addMessage} />
                </div>
            </div>
        </div>
    );
}

const maxLength40 = maxLengthCreator(40);

const AddMessageForm: React.FC<InjectedFormProps<NewMessageFormType, PropsType> & PropsType> = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field className={cont.input_mess} component={Textarea} name={'newMessageElement'} placeholder='Your news' validate={[required, maxLength40]} />
            {/* <textarea onChange={onMessageChange} ref={newMessageElement} className={cont.input_mess} placeholder="Your news"  value={props.dialogsPage.newMessageText} ></textarea> */}
            <button>Send</button>
        </form>
    );
}

const AddMessageFormRedux = reduxForm<NewMessageFormType, PropsType>({
    form: 'dialogsAddMessageForm'
})(AddMessageForm)

export default Dialogs;