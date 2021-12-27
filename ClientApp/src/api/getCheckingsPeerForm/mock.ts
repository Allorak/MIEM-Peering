import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IQuestionTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  return {
    success: true,
    payload: {
      rubrics: [
        {
          id: "123",
          order: 0,
          title: "Title 1",
          type: IQuestionTypes.TEXT,
          required: false
        },
        {
          id: "234",
          order: 1,
          title: "Title 2",
          type: IQuestionTypes.TEXT,
          required: true
        },
        {
          id: "345",
          order: 3,
          title: "Title 3",
          type: IQuestionTypes.MULTIPLE,
          responses: [
            {
              id: 1,
              response: "Вариант 1",
            },
            {
              id: 2,
              response: "Вариант 2",
            },
            {
              id: 3,
              response: "Вариант 3",
            },
            {
              id: 4,
              response: "Вариант 4",
            }
          ],
          required: false
        },

        {
          id: "asydasd",
          order: 5,
          title: "Title 33",
          type: IQuestionTypes.MULTIPLE,
          responses: [
            {
              id: 1,
              response: "hasjkdhjaskd",
            },
            {
              id: 2,
              response: "hjnn",
            },
            {
              id: 3,
              response: "bbhbh 3",
            },
            {
              id: 4,
              response: "zxzx 4",
            }
          ],
          required: true
        },
        {
          id: "456",
          order: 4,
          title: "Title 4",
          type: IQuestionTypes.SELECT_RATE,
          required: true,
          minValue: 0,
          maxValue: 5
        },

        {
          id: "852",
          order: 4,
          title: "Title 44",
          type: IQuestionTypes.SELECT_RATE,
          required: false,
          minValue: 0,
          maxValue: 5
        },
      ]
    }
  }
}
