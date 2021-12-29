import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IRole, PeerSteps } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(10000)

  return {
    success: true,
    payload: {
      userRole: IRole.expert,
      // step: PeerSteps.SECOND_STEP
    }
  }
}