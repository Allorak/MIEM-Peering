import { IExtpertItem } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = Array<IExtpertItem>

export { getExperts } from './getExperts';