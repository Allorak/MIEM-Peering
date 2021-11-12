import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: [
      {
        id: "work-1",
        author: {
          name: "Иванов Иван",
          id: "author-1"
        },
        responses: [
          {
            id: "question-1",
            order: 0,
            title: "Rate the work",
            response: 'Ответ Вани  на вопрос "Rate the work"'
          },
          {
            id: "question-2",
            order: 1,
            title: "What is good about this work? 👍"
          },
          {
            id: "question-3",
            order: 2,
            title: "What's wrong with this work? 👎",
            response: `Ответ Вани  на вопрос "What's wrong with this work? 👎"`
          }
        ]
      },
      {
        id: "work-2",
        author: {
          name: "Вася Пупкин",
          id: "author-2"
        },
        responses: [
          {
            id: "question-1",
            order: 0,
            title: "Rate the work",
            response: 'Ответ Васи  на вопрос "Rate the work"'
          },
          {
            id: "question-2",
            order: 1,
            title: "What is good about this work? 👍",
            response: 'Ответ Васи  на вопрос "What is good about this work? 👍"'
          },
          {
            id: "question-3",
            order: 2,
            title: "What's wrong with this work? 👎",
            response: `Ответ Васи  на вопрос "What's wrong with this work? 👎"`
          }
        ]
      }
    ]
  }
}
