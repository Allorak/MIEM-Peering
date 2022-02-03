import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const getStudentWork = async ({
  accessToken,
  taskId,
  workId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/submissions/get/submission=${workId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
