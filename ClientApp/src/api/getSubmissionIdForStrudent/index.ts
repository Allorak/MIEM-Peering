import { DeadlineStatus } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = {
    submissionId: string
}

export { getSubmissionIdForStrudent } from './getSubmissionIdForStrudent';