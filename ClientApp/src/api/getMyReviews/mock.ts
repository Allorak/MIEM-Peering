import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IQuestionTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  return {
    success: true,
    payload: [
      {
        studentName: "Мухаммад Юсупов",
        submissionId: "123",
        answers: [
          {
            questionId: "123",
            order: 0,
            title: "Моя проверка 123-1",
            type: IQuestionTypes.TEXT,
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Моя проверка 123-2",
            type: IQuestionTypes.TEXT,
            required: true,
            response: "Ответ 123-2"
          },
          {
            questionId: "345",
            order: 3,
            title: "Моя проверка 123-3",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "Вариант 1",
              },
              {
                id: 2,
                response: "Ответ 123-3",
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
            required: false,
            value: 2,
          },

          {
            questionId: "asydasd",
            order: 5,
            title: "Моя проверка 123-4",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "hasjkdhjaskd",
              },
              {
                id: 2,
                response: "Ответ 123-4",
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
            required: true,
            value: 2,
          },
        ]
      },
      {
        studentName: "Иван Иванов",
        submissionId: "234",
        answers: [
          {
            questionId: "123",
            order: 0,
            title: "Моя проверка 234-1",
            type: IQuestionTypes.TEXT,
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Моя проверка 234-2",
            type: IQuestionTypes.TEXT,
            required: true,
            response: "Ответ 123-2"
          },
          {
            questionId: "345",
            order: 3,
            title: "Моя проверка 234-3",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "Вариант 1",
              },
              {
                id: 2,
                response: "Ответ 123-3",
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
            required: false,
            value: 2,
          },

          {
            questionId: "asydasd",
            order: 5,
            title: "Моя проверка 234-4",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "hasjkdhjaskd",
              },
              {
                id: 2,
                response: "Ответ 123-4",
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
            required: true,
            value: 2,
          },
        ],
        expertAnswers: [
          {
            questionId: "123",
            order: 0,
            title: "Проверка эксперта 234-1",
            type: IQuestionTypes.TEXT,
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Проверка эксперта 234-2",
            type: IQuestionTypes.TEXT,
            required: true,
            response: "Ответ эксперта 123-2"
          },
          {
            questionId: "345",
            order: 3,
            title: "Проверка эксперта 234-3",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "Вариант 1",
              },
              {
                id: 2,
                response: "Ответ эксперта 234-3",
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
            required: false,
            value: 2,
          },

          {
            questionId: "asydasd",
            order: 5,
            title: "Проверка эксперта 234-4",
            type: IQuestionTypes.MULTIPLE,
            responses: [
              {
                id: 1,
                response: "hasjkdhjaskd",
              },
              {
                id: 2,
                response: "Ответ эксперта 234-4",
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
            required: true,
            value: 2,
          },
        ],
      }
    ]
  }
}
