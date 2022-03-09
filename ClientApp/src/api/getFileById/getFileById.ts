import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api } from '..'


export const getFileById = async ({
  accessToken,
  fileId
}: IRequestData): Promise<IResponseData> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/files/answer-file/file=${fileId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    responseType: 'blob'
  }

  const response = await api.request<IResponseData>(requestConfig)
  return response.data
}