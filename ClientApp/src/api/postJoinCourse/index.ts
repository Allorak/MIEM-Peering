import { ICourse, INewCourseRequest } from "../../store/types";

export interface IRequestData {
    accessToken: string,
    courseCode: string
}


export type IResponseData = ICourse

export { postJoinCourse } from './postJoinCourse';