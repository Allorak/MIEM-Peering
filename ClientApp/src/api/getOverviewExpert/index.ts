import { IOverviewExpertResponse } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverviewExpertResponse

export { getOverviewExpert } from './getOverviewExpert';