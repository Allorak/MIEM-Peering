import { IWorks } from "../../store/types";

export type IRequestData = {
  accessToken: string,
  taskId: string
}

export type IResponseData = IWorks

export { getWorksList } from './getWorksList';