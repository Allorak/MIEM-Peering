import { IOverviewStudentResponse } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverviewStudentResponse

export { getOverviewStudent } from './getOverviewStudent';