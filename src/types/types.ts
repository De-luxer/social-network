import { type } from "os"

export type PostsDataType = {
    id: number
    message: string
    likes: number
    coments: number
    avatar: string
}

export type ContactsType = {
    github: string
    vk: string
    facebook: string
    instagram: string
    twitter: string
    website: string
    youtube: string
    mainLink: string
}

export type PhotosType = {
    small: string | null
    large: string | null
}

export type ProfileType = {
    userId: number
    lookingForAJob: boolean
    lookingForAJobDescription?: string
    fullName: string
    contacts: ContactsType
    photos: PhotosType
    aboutMe?: string
}

export type UsersType = {
    id: number
    name: string
    status: string
    photos: PhotosType
    followed: boolean
}

export type DialogsType = {
    id: number
    name: string
    avatar: string
}

export type MessageType = {
    id: number
    message: string
    avatar: string
}

export type ChatMessageType = {
    message: string,
    photo: string,
    userId: number,
    userName: string
}

export type StatusType = "pending" | "ready" | "error";

export type GlobalMessagesType = {
    id: string
    message: string
    type: "error" | "info" | "success"
}