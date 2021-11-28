import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postRegistretion = async ({
  googleToken,
  role
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/users/google/add`,
    data: {
      googleToken,
      role
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
