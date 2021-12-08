import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: [
      {
        id: "123",
        name: "Мухаммад Юсупов",
      },
      {
        id: "234",
        name: "Иван Иванов"
      },
      {
        id: "345",
        name: "Вася Пупкин"
      },
    ]
  }
}
