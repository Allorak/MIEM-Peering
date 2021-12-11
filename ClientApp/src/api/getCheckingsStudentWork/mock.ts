import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IQuestionTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig, studentId: string): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  if (studentId === "123")
    return {
      success: true,
      payload: [
        {
          questionId: "123",
          order: 0,
          title: "Title 1",
          type: IQuestionTypes.TEXT,
          response: "Ответ М",
          required: false
        },
        {
          questionId: "234",
          order: 1,
          title: "Title 2",
          type: IQuestionTypes.TEXT,
          response: "Ответ М",
          required: true
        },
        {
          questionId: "345",
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
          response: "Вариант 4",
          required: false
        },
        {
          questionId: "456",
          order: 4,
          title: "Title 4",
          type: IQuestionTypes.SELECT_RATE,
          response: 4,
          required: true,
          minValue: 0,
          maxValue: 5
        },
      ]
    }

  if (studentId === "234")
    return {
      success: true,
      payload: [
        {
          questionId: "123",
          order: 0,
          title: "Title 1",
          type: IQuestionTypes.TEXT,
          response: "Ответ И",
          required: false
        },
        {
          questionId: "234",
          order: 1,
          title: "Title 2",
          type: IQuestionTypes.TEXT,
          response: "Ответ И",
          required: true
        },
        {
          questionId: "345",
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
          response: "Вариант 4",
          required: false
        },
        {
          questionId: "456",
          order: 4,
          title: "Title 4",
          type: IQuestionTypes.SELECT_RATE,
          response: 4,
          required: true,
          minValue: 0,
          maxValue: 5
        },
      ]
    }

  return {
    success: true,
    payload: [
      {
        questionId: "123",
        order: 0,
        title: "Title 1",
        type: IQuestionTypes.TEXT,
        response: "Ответ",
        required: false
      },
      {
        questionId: "234",
        order: 1,
        title: "Title 2",
        type: IQuestionTypes.TEXT,
        response: "Ответ",
        required: true
      },
      {
        questionId: "345",
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
        response: "Вариант 4",
        required: false
      },
      {
        questionId: "456",
        order: 4,
        title: "Title 4",
        type: IQuestionTypes.SELECT_RATE,
        response: 4,
        required: true,
        minValue: 0,
        maxValue: 5
      },
    ]
  }
}
