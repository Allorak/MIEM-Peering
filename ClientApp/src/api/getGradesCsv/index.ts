export type IRequestData = {
    accessToken: string,
    taskId: string
}

export type IResponseData = Blob

export { getGradesCsv } from './getGradesCsv';