import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { PeerSteps, PeerTaskTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      statistics: {
        total: 32,
        submissions: 18,
        review: 3
      },
      deadlines: {
        submissionStartDateTime: `${new Date()}`,
        submissionEndDateTime: `${new Date()}`,
        reviewStartDateTime: `${new Date()}`,
        reviewEndDateTime: `${new Date()}`
      },
      grades: [1,2,3,4,6,4,10],
      type: PeerTaskTypes.DOUBLE_BLIND,
      confidenceСoefficients: undefined,
      currentConfidenceСoefficients: undefined,
      step: PeerSteps.SECOND_STEP
    }
  }
}