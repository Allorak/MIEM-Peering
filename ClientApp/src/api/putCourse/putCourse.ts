import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const putCourse = async ({
  accessToken,
  course
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = true

  const enableCode = course.settings ? course.settings.enableCode : false

  const requestConfig: AxiosRequestConfig = {
    method: 'PUT',
    url: `api/v1/courses/${course.id}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      title: course.name,
      subject: course.subject,
      description: course.description ?? undefined,
      settings: {
        enableCode: enableCode
      }
    },
  }

  if (isMock) {
    const response = await mock(requestConfig)
    return response
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
