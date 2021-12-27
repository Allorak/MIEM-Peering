import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IQuestionTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig, workId: string): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  if (workId === "123")
    return {
      success: true,
      payload: {
        responses: [
          {
            questionId: "123",
            description: "Описание 1",
            order: 0,
            title: "Title 1",
            type: IQuestionTypes.TEXT,
            response: "Мухаммад Юсупов ответ 1",
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Title 2",
            type: IQuestionTypes.TEXT,
            response: "Мухаммад Юсупов ответ 2",
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
                response: "Мухаммад Юсупов",
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
            response: "Мухаммад Юсупов",
            required: false
          },
          {
            questionId: "456",
            order: 4,
            title: "Title 4",
            type: IQuestionTypes.SELECT_RATE,
            response: 1,
            required: true,
            minValue: 0,
            maxValue: 5
          },
        ]
      }
    }

  if (workId === "234")
    return {
      success: true,
      payload: {
        responses: [
          {
            questionId: "123",
            order: 0,
            title: "Title 1",
            type: IQuestionTypes.TEXT,
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Title 2",
            type: IQuestionTypes.TEXT,
            response: "Иван Иванов ответ 2",
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
                response: "Иван Иванов",
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
            response: "Иван Иванов",
            required: false
          },
          {
            questionId: "456",
            order: 4,
            title: "Title 4",
            type: IQuestionTypes.SELECT_RATE,
            response: 2,
            required: true,
            minValue: 0,
            maxValue: 5
          },
        ]
      }
    }

  return {
    success: true,
    payload: {
      responses: [
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
              response: "Ответ",
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
          response: "Ответ",
          required: false
        },
        {
          questionId: "456",
          order: 4,
          title: "Title 4",
          type: IQuestionTypes.SELECT_RATE,
          response: 3,
          required: true,
          minValue: 0,
          maxValue: 5
        },
      ]
    }
  }
}
