import { IAuthorForm, ISubmissionStatus } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = ISubmissionStatus

export { getSubmissionStatus } from './getSubmissionStatus';