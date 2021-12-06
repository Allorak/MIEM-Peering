import { IOverviewResponse } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverviewResponse

export { getOverview } from './getOverview';