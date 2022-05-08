import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'

export const deleteStudentCourse = async ({
  accessToken,
  courseId
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'DELETE',
    url: `/api/v1/courseusers/${courseId}`,
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}