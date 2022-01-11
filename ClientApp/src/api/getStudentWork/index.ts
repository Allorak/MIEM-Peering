import { IMyWorkForm } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string,
    workId: string
}

export type IResponseData = IMyWorkForm

export { getStudentWork } from './getStudentWork';