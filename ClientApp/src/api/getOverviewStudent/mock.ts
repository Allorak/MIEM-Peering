import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { PeerSteps, Reviewers } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      deadlines: {
        submissionStartDateTime: `${new Date()}`,
        submissionEndDateTime: `${new Date()}`,
        reviewStartDateTime: `${new Date()}`,
        reviewEndDateTime: `${new Date()}`
      },
      status: {
        submissionsToCheck: 14,
        submissionsNumber: 6
      },
      submissionStatus: false,
      studentGrades: {
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Преподаватель МЮ",
            value: 5
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Эксперт МЮ",
            value: 6
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 1 МЮ",
            value: 4.5
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 2 МЮ",
            value: 9
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 3 МЮ",
            value: 10
          },
        ],
        minGrade: 0,
        maxGrade: 10
      },
      step: PeerSteps.FIRST_STEP,
      studentConfidenceСoefficients: {
        until: 0.86,
        after: 0.46
      }
    }
  }
}