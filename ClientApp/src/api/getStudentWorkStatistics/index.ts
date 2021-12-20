import { IWorkStatistics } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    workId: string
}

export type IResponseData = IWorkStatistics

export { getStudentWorkStatistics } from './getStudentWorkStatistics';