import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      deadlines: {
        submissionStartDateTime: new Date().toLocaleDateString(),
        submissionEndDateTime: new Date().toLocaleDateString(),
        reviewStartDateTime: new Date().toLocaleDateString(),
        reviewEndDateTime: new Date().toLocaleDateString()
      },
      assignedWorksCount: 5,
      checkedWorksCount: 4,
    }
  }
}