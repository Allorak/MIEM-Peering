import { IOverview } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IOverview

export { getOverview } from './getOverview';