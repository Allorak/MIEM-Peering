import { IMyWorkForm } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    submissionId: string
}

export type IResponseData = IMyWorkForm

export { getMyWork } from './getMyWork';