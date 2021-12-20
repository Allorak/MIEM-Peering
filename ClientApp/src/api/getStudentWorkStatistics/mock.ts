import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IQuestionTypes, Reviewers, WorkGraphTypes, WorkStatisticsTypes } from '../../store/types'


export const mock = async (requestConfig: AxiosRequestConfig, workId: string): Promise<IResponse<IResponseData>> => {
  await delay(1500)
  if (workId === "123")
    return {
      success: true,
      payload: [
        {
          statisticType: WorkStatisticsTypes.GRAPH,
          graphType: WorkGraphTypes.FINAL,
          coordinates: [
            {
              reviewer: Reviewers.TEACHER,
              name: "Преподаватель МЮ",
              value: 9
            },
            {
              reviewer: Reviewers.EXPERT,
              name: "Эксперт МЮ",
              value: 8
            },
            {
              reviewer: Reviewers.PEER,
              name: "Пир 1 МЮ",
              value: 7
            },
            {
              reviewer: Reviewers.PEER,
              name: "ПИр 2 МЮ",
              value: 7
            },
            {
              reviewer: Reviewers.PEER,
              name: "ПИР 3 МЮ",
              value: 9
            },
          ],
          minGrade: 0,
          maxGrade: 10
        },
        {
          statisticType: WorkStatisticsTypes.GRAPH,
          graphType: WorkGraphTypes.CRITERIA,
          title: "Критерий 1",
          coordinates: [
            {
              reviewer: Reviewers.TEACHER,
              name: "Преподаватель МЮ",
              value: 7
            },
            {
              reviewer: Reviewers.EXPERT,
              name: "Эксперт МЮ",
              value: 6.5
            },
            {
              reviewer: Reviewers.PEER,
              name: "Пир 1 МЮ",
              value: 1
            },
            {
              reviewer: Reviewers.PEER,
              name: "Пир 2 МЮ",
              value: 9
            },
            {
              reviewer: Reviewers.PEER,
              name: "Пир 3 МЮ",
              value: 3
            },
          ],
          minGrade: 0,
          maxGrade: 10
        },
        {
          statisticType: WorkStatisticsTypes.GRAPH,
          graphType: WorkGraphTypes.CRITERIA,
          title: "Критерий 2",
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
        {
          statisticType: WorkStatisticsTypes.RESPONSE,
          name: "Преподаватель МЮ",
          reviewer: Reviewers.TEACHER,
          responses: [
            {
              questionId: "123",
              description: "Описание 1",
              order: 0,
              title: "Title 1",
              type: IQuestionTypes.TEXT,
              response: "Ответ преподавателя 1",
              required: false
            },
            {
              questionId: "234",
              order: 1,
              title: "Title 2",
              type: IQuestionTypes.TEXT,
              response: "Ответ преподавателя 2",
              required: true
            },
          ]
        },
        {
          statisticType: WorkStatisticsTypes.RESPONSE,
          name: "Эксперт МЮ ",
          reviewer: Reviewers.EXPERT,
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
              response: "Ответ экперта 2 МЮ",
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
                  response: "Ответ эксперта 3 МЮ",
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
              response: "Ответ эксперта 3 МЮ",
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
      ]
    }

  if (workId === "234")
  return {
    success: true,
    payload: [
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.FINAL,
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Преподаватель ИИ",
            value: 1
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Эксперт ИИ",
            value: 2
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 1 ИИ",
            value: 2
          },
          {
            reviewer: Reviewers.PEER,
            name: "ПИр 2 ИИ",
            value: 3
          },
          {
            reviewer: Reviewers.PEER,
            name: "ПИР 3 ИИ",
            value: 1.5
          },
        ],
        minGrade: 0,
        maxGrade: 10
      },
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.CRITERIA,
        title: "Критерий 1",
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Преподаватель ИИ",
            value: 7.1
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Эксперт ИИ",
            value: 7.3
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 1 ИИ",
            value: 6
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 2 ИИ",
            value: 6.9
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 3 ИИ",
            value: 6.8
          },
        ],
        minGrade: 0,
        maxGrade: 10
      },
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.CRITERIA,
        title: "Критерий 2",
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Преподаватель ИИ",
            value: 8.8
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Эксперт ИИ",
            value: 7.8
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 1 ИИ",
            value: 7.5
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 2 ИИ",
            value: 8.1
          },
          {
            reviewer: Reviewers.PEER,
            name: "Пир 3 ИИ",
            value: 7.3
          },
        ],
        minGrade: 0,
        maxGrade: 10
      },
      {
        statisticType: WorkStatisticsTypes.RESPONSE,
        name: "Преподаватель ИИ",
        reviewer: Reviewers.TEACHER,
        responses: [
          {
            questionId: "123",
            description: "Описание 1",
            order: 0,
            title: "Title 1",
            type: IQuestionTypes.TEXT,
            response: "Ответ преподавателя 1 ИИ",
            required: false
          },
          {
            questionId: "234",
            order: 1,
            title: "Title 2",
            type: IQuestionTypes.TEXT,
            response: "Ответ преподавателя 2 ИИ",
            required: true
          },
        ]
      },
      {
        statisticType: WorkStatisticsTypes.RESPONSE,
        name: "Эксперт МЮ ",
        reviewer: Reviewers.EXPERT,
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
            response: "Ответ экперта 2 ИИ",
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
                response: "Ответ эксперта 3 ИИ",
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
            response: "Ответ эксперта 3 ИИ",
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
    ]
  }

  return {
    success: true,
    payload: [
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.FINAL,
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Иван Иванов",
            value: 7
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Мухаммад Юсупов",
            value: 6
          },
          {
            reviewer: Reviewers.PEER,
            name: "Вася",
            value: 1
          },
          {
            reviewer: Reviewers.PEER,
            name: "Петя",
            value: 9
          },
          {
            reviewer: Reviewers.PEER,
            name: "Федя",
            value: 3
          },
        ],
        minGrade: 0,
        maxGrade: 9
      },
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.FINAL,
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Иван Иванов",
            value: 7
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Мухаммад Юсупов",
            value: 6
          },
          {
            reviewer: Reviewers.PEER,
            name: "Вася",
            value: 1
          },
          {
            reviewer: Reviewers.PEER,
            name: "Петя",
            value: 9
          },
          {
            reviewer: Reviewers.PEER,
            name: "Федя",
            value: 3
          },
        ],
        minGrade: 0,
        maxGrade: 9
      },
      {
        statisticType: WorkStatisticsTypes.GRAPH,
        graphType: WorkGraphTypes.FINAL,
        coordinates: [
          {
            reviewer: Reviewers.TEACHER,
            name: "Иван Иванов",
            value: 7
          },
          {
            reviewer: Reviewers.EXPERT,
            name: "Мухаммад Юсупов",
            value: 6
          },
          {
            reviewer: Reviewers.PEER,
            name: "Вася",
            value: 1
          },
          {
            reviewer: Reviewers.PEER,
            name: "Петя",
            value: 9
          },
          {
            reviewer: Reviewers.PEER,
            name: "Федя",
            value: 3
          },
        ],
        minGrade: 0,
        maxGrade: 9
      },
      {
        statisticType: WorkStatisticsTypes.RESPONSE,
        name: "Юсупов М А",
        reviewer: Reviewers.TEACHER,
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
        ]
      },
      {
        statisticType: WorkStatisticsTypes.RESPONSE,
        name: "Петров ",
        reviewer: Reviewers.TEACHER,
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
    ]
  }
}
