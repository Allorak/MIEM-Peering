import { IPeerResponses } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    studentId: string,
    responses: IPeerResponses
}

export type IResponseData = {}

export { postReviewByTeacher } from './postReviewByTeacher';