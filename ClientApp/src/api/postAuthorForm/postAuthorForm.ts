import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'

export const postAuthorForm = async ({
  accessToken,
  taskId,
  responses
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const formData = new FormData()

  formData.append('taskId', taskId)
  formData.append("answers", JSON.stringify(
    responses.answers.map((item, index) => {
      if (item.file) {
        return {
          questionId: item.questionId,
          fileId: `#${index}-${item.file.name}`
        }
      }
      return item
    })

  ))

  responses.answers.map((item, index) => {
    if (item.file) {
      formData.append("files[]", item.file, `#${index}-${item.file.name}`)
    }
  })


  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: '/api/v1/submissions/add',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept-Language': 'ru',
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}