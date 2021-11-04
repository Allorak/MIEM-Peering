import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { ITaskItem } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      newTaskId: "id"
    }
  }
}
