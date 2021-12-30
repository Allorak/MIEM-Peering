import { IPeerResponses } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    responses: IPeerResponses
}

export type IResponseData = {}

export { postAuthorForm } from './postAuthorForm';