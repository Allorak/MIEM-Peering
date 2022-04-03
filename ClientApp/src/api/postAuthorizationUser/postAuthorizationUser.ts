import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postAuthorizationUser = async ({
  email,
  pass
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/authentication/login`,
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email,
      pass
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
