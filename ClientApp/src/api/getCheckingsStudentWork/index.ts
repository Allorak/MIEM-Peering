import { IStudentWork } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    studentId: string
}

export type IResponseData = IStudentWork

export { getCheckingsStudentWork } from './getCheckingsStudentWork';