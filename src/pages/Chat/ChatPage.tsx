import React, { useEffect, useRef, useState } from "react";
import style from "./Chat.module.css"
import formStyle from "../../components/common/FormsControls/FormsControls.module.css"
import Avatar from "../../components/common/Avatar/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { ChatMessageIdType, sendMessage, startMessagesListening, stopMessagesListening } from "../../redux/chat-reducer";
import { AppStateType } from "../../redux/redux-store";
import { ChatMessageType } from "../../types/types";
import { NavLink } from "react-router-dom";
import Arrow from "../../components/common/Arrow/Arrow";
import { ReactComponent as Arrowhead } from "../../assets/images/Arrowhead.svg";
import { ReactComponent as EmptyChatFon } from "../../assets/images/Empty-chat-fon.svg";
import Preloader from "../../components/common/Preloader/Preloader";

const ChatPage: React.FC = () => {
    return <div className={style.chat_page}>
        <Chat />
    </div>
}

const Chat: React.FC = () => {
    const dispatch = useDispatch();
    const status = useSelector((state: AppStateType) => state.chat.status);
    const messagesEmpty: ChatMessageIdType[] = [];
    const isAutoScrollDownRef = useRef(false);
    const messageAnchorRef = useRef<HTMLDivElement>(null);
    const [, forceUpdate] = useState({});

    const handleScrollChange = (newValue: boolean) => {
        if (isAutoScrollDownRef.current !== newValue) {
            isAutoScrollDownRef.current = newValue;
            forceUpdate({});
        }
    };

    const handleScrollDown = () => {
        messageAnchorRef.current?.scrollIntoView({block: "end", behavior: "auto"});
    }

    useEffect(() => {
        dispatch(startMessagesListening());
        return () => {
            dispatch(stopMessagesListening(messagesEmpty));
        }
    }, []);

    return <div className={style.chat_wrapper}>
        {status === "error" && <div className={style.chat_error}>Some Error occured. Please refresh the page</div>}
        <div className={style.chat_content}>
            <Messages ref={messageAnchorRef} onScrollPositionChange={handleScrollChange} />
            <AddMessageForm handleScrollDown={handleScrollDown} isAutoScrollDownRef={isAutoScrollDownRef} />
        </div>
    </div>
}

const Messages = React.memo(React.forwardRef<HTMLDivElement, {onScrollPositionChange: (value: boolean) => void}> ((props, endDivRef) => {
    const messages = useSelector((state: AppStateType) => state.chat.messages);
    const authId = useSelector((state: AppStateType) => state.auth.id);
    const status = useSelector((state: AppStateType) => state.chat.status);
    const isFetching = useSelector((state: AppStateType) => state.chat.isFetching);
    
    const isAutoScroll = useRef(true);

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        const isAtBottom = Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 100;
        const isDistanceFromBottom = (element.scrollHeight - element.scrollTop - element.clientHeight) > 300;
        
        if (isAutoScroll.current !== isAtBottom) {
            isAutoScroll.current = isAtBottom;
        }
        props.onScrollPositionChange(isDistanceFromBottom);
    }

    useEffect(() => {
        if(isAutoScroll.current) {
            // @ts-ignore
            endDivRef.current?.scrollIntoView({block: "end", behavior: "auto"});
        }
    }, [messages]);
    console.log("Status: " + status)

    if (!isFetching && status === "ready" && messages.length === 0) {
        return <div className={style.messages} onScroll={scrollHandler}>
            <div className={style.empty_messages_wrap}>
                <div className={style.empty_messages_content}>
                    {/* <h4>Перед тобой пустое поле, самурай. Будь первым, кто оставит на нём свой след</h4> */}
                    <h4>Before you lies an empty field, samurai. Be the first to leave your mark upon it</h4>
                    <EmptyChatFon />
                </div>
            </div>
            <div ref={endDivRef}></div>
        </div>
    } else {
        return <div className={`${style.messages} ${isFetching ? style.isFetchingCenter : ""}`} onScroll={scrollHandler}>
            {isFetching ? <Preloader isCircleCenter={true} /> : messages.map((m) => <Message key={m.id} message={m} authId={authId}/>)}
            <div ref={endDivRef}></div>
        </div>
    }
}))

const Message: React.FC<{message: ChatMessageType; authId: number | null}> = React.memo((props) => {
    const isUserMessage = props.message.userId === props.authId;
    return <div className={`${style.message} ${isUserMessage ? style.user_message : ""}`}>
        <NavLink to={"/profile/" + props.message.userId}  className={style.user_link}>
            <div className={style.message_info}>
                <img src={!props.message.photo ? Avatar : props.message.photo} className={style.message_avatar} alt={"User avatar"} />
                <p className={style.message_author}>{props.message.userName}</p>
            </div>
        </NavLink>
        <div>
            <p className={style.message_text}>{props.message.message.trim()}</p>
        </div>
    </div>
})

const AddMessageForm: React.FC<{isAutoScrollDownRef: React.MutableRefObject<boolean>; handleScrollDown: () => void}> = (props, ref) => {
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const status = useSelector((state: AppStateType) => state.chat.status);
    const isFetching = useSelector((state: AppStateType) => state.chat.isFetching);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const error = useRef<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const el = textareaRef.current;
        if (!el) return;
        setMessage(e.target.value);
        if (el.value.length > 100) {
            error.current = true;
        } else {
            error.current = false;
        }
        // Сбрасываем высоту чтобы scrollHeight был реальным
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 381) + "px";
    };

    const sendMessageHandler = () => {
        const el = textareaRef.current;
        if (!message) {
            return;
        } else {
            dispatch(sendMessage(message));
            setMessage("");
            // @ts-ignore
            el.style.height = "auto";
            el?.focus();
        }
    };

    return <div className={`${style.message_form} ${error.current ? style.form_error : ""}`}>
        <div className={style.label_wrapper}>
            <label className={formStyle.label_container}>
                <textarea ref={textareaRef} className={style.chat_textarea} rows={1} placeholder="Write message" onChange={handleChange} value={message}></textarea>
                <div className={formStyle.btn_wrapper + " " + style.message_btn_wrapper}>
                    <button disabled={isFetching || error.current || status !== "ready" || message.trim() === ""} className={style.send_btn + " " + formStyle.svg_btn} onClick={sendMessageHandler}><Arrowhead /></button>
                </div>
            </label>
            {error.current && <span className={style.chat_message_form_error}>Max 100 characters</span>}
        </div>
        <button onClick={props.handleScrollDown} disabled={!props.isAutoScrollDownRef.current} type="button" className={`${style.scroll_down_btn} ${props.isAutoScrollDownRef.current ? style.scroll_down_btn_active : ""}`}><Arrow /></button>
    </div>
}

export default ChatPage;