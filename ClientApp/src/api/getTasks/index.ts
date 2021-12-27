import { ITasks } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    courseId: string
}

export type IResponseData = ITasks

export { getTasks } from './getTasks';