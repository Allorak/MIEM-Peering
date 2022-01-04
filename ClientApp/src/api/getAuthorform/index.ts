import { IAuthorForm } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IAuthorForm

export { getAuthorform } from './getAuthorform';