import { IGrades } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = {
    students: Array<IGrades>
}

export { getGrades } from './getGrades';