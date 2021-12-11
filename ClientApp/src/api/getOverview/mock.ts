import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  const data = [] as Array<number>

  for (let i = 1; i < 160; i++) {
    data.push(Math.random() * (10 - 0) + 0)
  }

  return {
    success: true,
    payload: {
      statistics: {
        submissions: 50,
        total: 150,
        review: 140
      },
      deadlines: {
        submissionStartDateTime: new Date(),
        submissionEndDateTime: new Date(),
        reviewStartDateTime: new Date(),
        reviewEndDateTime: new Date()
      },
      grades: data.map(item => item)

    }
  }
}
