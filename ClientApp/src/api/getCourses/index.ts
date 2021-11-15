import { IResponseCourses } from "../../store/types";

export type IRequestData = {
    accessToken: string
}

export type IResponseData = Array<IResponseCourses>

export { getCourses } from './getCourses';