import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postNewCourse = async ({
  accessToken,
  name,
  description,
  subject
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `api/v1/courses/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      title: name,
      subject: subject,
      description: description ?? undefined
    },
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
