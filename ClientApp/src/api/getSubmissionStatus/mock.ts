import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { ISubmissionStatus } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1500)

  return {
    success: true,
    payload: ISubmissionStatus.NOT_COMPLETED
  }
}
