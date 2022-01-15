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
        submissionStartDateTime: new Date(),
        submissionEndDateTime: new Date(),
        reviewStartDateTime: new Date(),
        reviewEndDateTime: new Date()
      },
      grades: [1,2,3,4,6,4,10],
      type: PeerTaskTypes.SINGLE_BLIND,
      confidenceСoefficients: [1,0.5,0.6,0.76,0.75,0.3,0.4],
      currentConfidenceСoefficients: [0.4,0.2,0.3,1,0.35,1,0.65],
      step: PeerSteps.SECOND_STEP
    }
  }
}