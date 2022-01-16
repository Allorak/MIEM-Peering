import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postGUserCheck = async ({ googleToken }: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/authentication/google`,
    headers: {
      'Accept-Language': 'ru',
    },
    data: {
      googleToken
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
