import { ICatalog } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = Array<ICatalog>

export { getCheckingsStudentList } from './getCheckingsStudentList';