import { INewTask, INewTaskResponse } from "../../store/types";

export type IRequestData = {
    accessToken: string,
    courseId: string,
    task: INewTask
}

export type IResponseData = INewTaskResponse

export { postTask } from './postTask';