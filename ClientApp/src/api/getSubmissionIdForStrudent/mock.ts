import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { DeadlineStatus } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  return {
    success: true,
    payload: {
      submissionId: "3F6BD82F-8623-47FB-99FD-1DBDA41D87EB"
    }
  }
}