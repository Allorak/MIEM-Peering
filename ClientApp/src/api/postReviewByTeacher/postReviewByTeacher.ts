import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postReviewByTeacher = async ({
  accessToken,
  taskId,
  workId,
  responses
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const isMock = false

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `/api/v1/reviews/add`,
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
    },
    data: {
      submissionId: workId,
      answers: responses.answers
    }
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
