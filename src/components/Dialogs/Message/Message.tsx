import React from 'react';
import cont from '../Dialogs.module.css';

type PropsType = {
    message: string
    avatar: string
    id: number
}

const Message: React.FC<PropsType> = (props) => {
    return (
        <div className={cont.item + ' ' + cont.message}>
            <img className={cont.avatar_img} src={props.avatar} alt={'user avatar'} />
            <p>{props.message}</p>
        </div>
    );
}

export default Message;