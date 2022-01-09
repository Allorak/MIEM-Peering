import { IExpertItem } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    courseId: string
}

export type IResponseData = null | undefined

export { getNewTaskStep } from './getNewTaskStep';