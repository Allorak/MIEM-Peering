import { IDashboardTaskProps } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IDashboardTaskProps

export { getTaskProps } from './getTaskProps';