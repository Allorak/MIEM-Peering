import { IMyReviews } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IMyReviews

export { getMyReviews } from './getMyReviews';