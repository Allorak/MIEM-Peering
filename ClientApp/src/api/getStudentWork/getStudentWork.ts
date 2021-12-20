import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const getStudentWork = async ({
  accessToken,
  taskId,
  workId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = true

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/tasks/${taskId}/works/${workId}/get`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  if (isMock) return await mock(requestConfig, workId)

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
