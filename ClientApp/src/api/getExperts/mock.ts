import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: [
      {
        email: "mayusupov@miem.hse.ru",
        name: "Мухаммад Юсупов",
        taskComplete: 5,
        assignedTasks: 10,
        imgUrl: "https://lh3.googleusercontent.com/a-/AOh14GjHN6VPnX6IIeAMIPj9vCoqBVzsg2TIKvEffNKk=s96-c"
      },
      {
        email: "iivanov@miem.hse.ru",
        name: "Иван Иванов",
        taskComplete: 5,
        assignedTasks: 10
      },
      {
        email: "vpupkin@miem.hse.ru",
        name: "Вася Пупкин",
        taskComplete: 10,
        assignedTasks: 10
      },
    ]
  }
}
