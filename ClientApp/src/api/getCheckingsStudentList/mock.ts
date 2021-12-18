import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1000)

  return {
    success: true,
    payload: {
      students: [
        {
          id: "123",
          fullName: "Мухаммад Юсупов",
        },
        {
          id: "234",
          fullName: "Иван Иванов"
        },
        {
          id: "345",
          fullName: "Вася Пупкин"
        },
      ]
    }
  }
}
