import cont from './Dialogs.module.css';
import User from './User/User';
import Message from './Message/Message';
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Textarea } from '../common/FormsControls/FormsControls';
import { maxLengthCreator, required } from '../../utils/validators/validators';

const Dialogs = (props) => {

    let dialogsUsers = props.dialogsPage.usersData.map( users =>  <User name={users.name} avatar={users.avatar} id={users.id} />  );

    let dialogsMessages = props.dialogsPage.messagesData.map( messages =>  <Message message={messages.message} avatar={messages.avatar} id={messages.id} />  );

    let addNewMessage = (values) => {
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
                    <AddMessageFormRedux onSubmit={addNewMessage} />
                </div>
            </div>
        </div>
    );
}

const maxLength40 = maxLengthCreator(40);

const AddMessageForm = (props) => {
    return (
        <form onSubmit={props.handleSubmit}>
            <Field className={cont.input_mess} component={Textarea} name={'newMessageElement'} placeholder='Your news' validate={[required, maxLength40]} />
            {/* <textarea onChange={onMessageChange} ref={newMessageElement} className={cont.input_mess} placeholder="Your news"  value={props.dialogsPage.newMessageText} ></textarea> */}
            <button>Send</button>
        </form>
    );
}

const AddMessageFormRedux = reduxForm({
    form: 'dialogsAddMessageForm'
})(AddMessageForm)

export default Dialogs;