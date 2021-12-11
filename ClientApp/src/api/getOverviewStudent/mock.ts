import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      deadlines: {
        sBegin: new Date(),
        sEnd: new Date(),
        rBegin: new Date(),
        rEnd: new Date()
      },
      status: {
        count: 2
      }
    }
  }
}