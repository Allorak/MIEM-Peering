import { IOverviewExpert } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverviewExpert

export { getOverviewExpert } from './getOverviewExpert';