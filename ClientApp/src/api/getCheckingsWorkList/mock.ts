import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1000)

  return {
    success: true,
    payload:
      [
        {
          workId: "123",
          studentName: "Мухаммад Юсупов",
        },
        {
          workId: "234",
          studentName: "Иван Иванов"
        },
        {
          workId: "345",
          studentName: "Вася Пупкин"
        },
      ]
  }
}
