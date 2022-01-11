import { IUserProfile } from "../../store/types";

export type IRequestData = {
    accessToken: string
}

export type IResponseData = IUserProfile

export { getUserProfile } from './getUserProfile';