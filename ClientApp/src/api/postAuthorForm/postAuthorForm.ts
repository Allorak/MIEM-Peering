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
    responses.answers.map(item => {
      if (item.file) {
        return {
          questionId: item.questionId,
          ...(item.file && item.file.length > 0 && {
            fileIds: item.file.map((file, index) => (`${file.name}`))
          })
        }
      }
      return item
    })

  ))

  responses.answers.map((item) => {
    if (item.file && item.file.length > 0) {
      item.file.map((file, index) => {
        formData.append("files", file, `${file.name}`)
      })
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