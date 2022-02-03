import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const getMyWork = async ({
  accessToken,
  submissionId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'GET',
    url: `/api/v1/submissions/get/submission=${submissionId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
