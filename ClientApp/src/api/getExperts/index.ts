import { IExpertItem } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = Array<IExpertItem>

export { getExperts } from './getExperts';