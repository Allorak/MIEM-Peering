import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const postReviewByTeacher = async ({
  accessToken,
  taskId,
  workId,
  responses
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `https://localhost:5001/api/v1/reviews/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      // taskId,
      submissionId: workId,
      answers: responses.answers
    }
  }

  if (isMock) return await mock(requestConfig)

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
