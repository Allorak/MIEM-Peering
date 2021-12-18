import { IStudentWork } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    workId: string
}

export type IResponseData = IStudentWork

export { getStudentWork } from './getStudentWork';