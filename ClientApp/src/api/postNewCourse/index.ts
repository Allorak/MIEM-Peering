import { ICourse, INewCourseRequest } from "../../store/types";

export interface IRequestData extends INewCourseRequest {
    accessToken: string
}


export type IResponseData = ICourse

export { postNewCourse } from './postNewCourse';