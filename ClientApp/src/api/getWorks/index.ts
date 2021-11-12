import { IWorkItem } from "../../store/types";

export type IRequestData = {
  accessToken: string,
  taskId: string
}

export type IResponseData = IWorkItem[]

export { getWorks } from './getWorks';