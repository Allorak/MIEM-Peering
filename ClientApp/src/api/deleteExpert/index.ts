import { IExtpertItem } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    email: string
}

export type IResponseData = string

export { deleteExpert } from './deleteExperts';