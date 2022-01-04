import { IAuthorFormResponses } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    responses: IAuthorFormResponses
}

export type IResponseData = {}

export { postAuthorForm } from './postAuthorForm';