import React from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { Input, Textarea } from "../../common/FormsControls/FormsControls";
import cont from "../Profile.module.css";
import contForm from "../../common/FormsControls/FormsControls.module.css"
import { ProfileType } from "../../../types/types";

type PropsType = {
    deactivateEditMode: () => void
    profile: ProfileType
}

const ProfileDataForm: React.FC<InjectedFormProps<ProfileType, PropsType> & PropsType> = (props) => {
    return <form className={cont.profile_description} onSubmit={props.handleSubmit}>
        <button>Save</button>
        <button onClick={props.deactivateEditMode} type={"button"}>Cancel</button><br/>
        {props.error ? <div className={contForm.errorRrr}>{props.error}</div> : null}
        <label>About me: <Field placeholder="About me" component={Textarea} name="aboutMe" validate={[]}/> </label><br/>
        <label>Looking for a job: <Field component={Input} name="lookingForAJob" validate={[]} type={"checkbox"}/> </label><br/>
        <label>Working status: <Field placeholder="Working status" component={Textarea} name="lookingForAJobDescription" validate={[]}/> </label><br/>
        <label>Full name: <Field placeholder="Full name" component={Input} name="fullName" validate={[]}/> </label><br/>
        <div>Contacts:
            <ul className={cont.contacts_list}>
                <li>Facebook: <Field placeholder="Facebook" component={Input} name="contacts.facebook" validate={[]}/></li>
                <li>Website: <Field placeholder="Website" component={Input} name="contacts.website" validate={[]}/></li>
                <li>VK: <Field placeholder="VK" component={Input} name="contacts.vk" validate={[]}/></li>
                <li>Twitter: <Field placeholder="Twitter" component={Input} name="contacts.twitter" validate={[]}/></li>
                <li>Instagram: <Field placeholder="Instagram" component={Input} name="contacts.instagram" validate={[]}/></li>
                <li>Youtube: <Field placeholder="Youtube" component={Input} name="contacts.youtube" validate={[]}/></li>
                <li>Github: <Field placeholder="Github" component={Input} name="contacts.github" validate={[]}/></li>
                <li>MainLink: <Field placeholder="MainLink" component={Input} name="contacts.mainLink" validate={[]}/></li>
            </ul>
        </div>
    </form>
}

const ProfileDataFormRedux = reduxForm<ProfileType, PropsType>({
    form: 'edit-profile'
})(ProfileDataForm)

export default ProfileDataFormRedux;