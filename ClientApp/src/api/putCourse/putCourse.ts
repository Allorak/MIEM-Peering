import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const putCourse = async ({
  accessToken,
  course
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const enableCode = course.settings ? course.settings.enableCode : false

  const requestConfig: AxiosRequestConfig = {
    method: 'PUT',
    url: `/api/v1/courses/put/course=${course.id}`,
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

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
