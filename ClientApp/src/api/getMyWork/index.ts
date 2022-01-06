import { IMyWorkForm } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IMyWorkForm

export { getMyWork } from './getMyWork';