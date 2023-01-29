import cont from '../Dialogs.module.css';

const Message = (props) => {
    return (
        <div className={cont.item + ' ' + cont.message}>
            <img className={cont.avatar_img} src={props.avatar} />
            <p>{props.message}</p>
        </div>
    );
}

export default Message;