import React, {useEffect, useState, useRef} from "react"
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from "../../redux/redux-store";
import { actions as appActions } from '../../redux/app-reducer';
import cont from "./Notifications.module.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Если открыть страницу определёного юзера через URL то будет много лишних запросов на серв
// При долгом нахождении на страници чата дублируются сообщения
// ограничение в 100 символов на статнице чата для поля ввода

const Notifications = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state: AppStateType) => state.app.messages)
    const [isHovered, setIsHovered] = useState(false);
    const lastTickRef = useRef<number>(Date.now());
    const timersRef = useRef<Record<string, number>>({});
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const visibleMessages = messages.slice(0, 4);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            if (isHovered) return;
            const now = Date.now();
            const timeDifference = now - lastTickRef.current;
            lastTickRef.current = now;

            visibleMessages.forEach((m) => {
                const prev = timersRef.current[m.id] || 0;
                const updateTimer = prev + timeDifference;
                timersRef.current[m.id] = updateTimer;

                if (updateTimer >= 6000) {
                    dispatch(appActions.deleteGlobalMessage(m.id));
                    delete timersRef.current[m.id];
                }
            });
        }, 200);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [visibleMessages, isHovered, dispatch]);

    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsHovered(true);
        }
    }

    const handleMouseOut = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsHovered(false);
            lastTickRef.current = Date.now(); // сбрасываем отсчёт при выходе
        }
        
    };

    const handleClose = (id: string) => {
        dispatch(appActions.deleteGlobalMessage(id));
        delete timersRef.current[id];
    };
    
    return (
        <div className={cont.notifications} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <TransitionGroup component={null}>
                {[...visibleMessages].reverse().map((m) => {
                    return (
                        <CSSTransition key={m.id} timeout={300} classNames={{ enter: cont.enter, enterActive: cont.enter_active, exit: cont.leave, exitActive: cont.leave_active }}>
                            <div className={`${cont.notification} ${cont["notification_" + m.type]}`}>
                                <p>{m.message}</p>
                                <button className={cont.notification_btn} onClick={() => handleClose(m.id)} type="button">X</button>
                            </div>
                        </CSSTransition>
                    );
                })}
            </TransitionGroup>
        </div>
    )
}

export default Notifications;