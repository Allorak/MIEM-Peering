import { IMyWorkReviews } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IMyWorkReviews

export { getMyWorkReviews } from './getMyWorkReviews';