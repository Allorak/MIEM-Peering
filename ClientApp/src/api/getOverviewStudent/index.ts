import { IOverviewStudent } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverviewStudent

export { getOverviewStudent } from './getOverviewStudent';