import { IWorkItem } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = Array<IWorkItem>

export { getCheckingsWorkList } from './getCheckingsWorkList';