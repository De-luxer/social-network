import React, { ChangeEvent, useEffect, useState } from "react";
import cont from "../Profile.module.css";

type PropsType = {
    status: string
    updateStatus: (status: string) => void
    isOwner: boolean
}

const ProfileStatusWithHooks: React.FC<PropsType> = (props) => {
    let [editMode, setEditMode] = useState(false);
    let [status, setStatus] = useState(props.status);

    useEffect(() => {
        setStatus(props.status);
    }, [props.status]);

    const activateEditMode = () => {
        setEditMode(true);
    }
    const deactivateEditMode = () => {
        setEditMode(false);
        props.updateStatus(status);
    }
    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    }
    return (
        <>
            {!props.isOwner ? 
            <div>
                <p className={cont.info_status} title={props.status}>{props.status || "---"}</p>
            </div> : 
            <div>
                {!editMode &&
                    <p className={cont.info_status} onDoubleClick={activateEditMode} title={props.status}>{props.status || "---"}</p>
                }
                {editMode && 
                    <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode} className={cont.input_status_profile} value={status}/>
                }
            </div>}
        </>
    );
}

export default ProfileStatusWithHooks;