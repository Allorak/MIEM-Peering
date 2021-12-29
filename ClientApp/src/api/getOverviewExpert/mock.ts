import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      deadlines: {
        submissionStartDateTime: new Date(),
        submissionEndDateTime: new Date(),
        reviewStartDateTime: new Date(),
        reviewEndDateTime: new Date()
      },
      assignedWorksCount: 5,
      checkedWorksCount: 4,
    }
  }
}