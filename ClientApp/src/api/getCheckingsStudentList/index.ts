import { IStudentList } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IStudentList

export { getCheckingsStudentList } from './getCheckingsStudentList';