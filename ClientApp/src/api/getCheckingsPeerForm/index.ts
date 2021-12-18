import { IPeerForm, IStudentWork } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = IPeerForm

export { getCheckingsPeerForm } from './getCheckingsPeerForm';