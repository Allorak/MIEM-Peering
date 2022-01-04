import { DeadlineStatus } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = DeadlineStatus

export { getSubmissionDeadlineStatus } from './getSubmissionDeadlineStatus';