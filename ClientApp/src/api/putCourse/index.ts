import { IUpdateCourseRequest } from "../../store/types";

export interface IRequestData {
    accessToken: string,
    course: IUpdateCourseRequest
}


export type IResponseData = {}

export { putCourse } from './putCourse';