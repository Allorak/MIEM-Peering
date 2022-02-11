export type IRequestData = {
    accessToken: string,
    fileId: string
}

export type IResponseData = Blob

export { getFileById } from './getFileById';