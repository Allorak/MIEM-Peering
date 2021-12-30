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
            "order": 0,
            "title": "Эссе о полезности",
            "description": 'Напишите эссе длиной не менее 300 символов на тему : \"Почему ООП полезно в промышленных предприятиях"',
            "required": true,
            "type": IQuestionTypes.TEXT
        },
        {
          "order": 1,
          "title": "Пример приложений",
          "description": "Приведите пример приложений, которым Вы пользуетесь, использующих ООП",
          "required": true,
          "type": IQuestionTypes.SHORT_TEXT,
        },
        {
          "order": 2,
          "title": "Пример приложений",
          "description": "Приведите пример приложений, которым Вы пользуетесь, использующих ООП",
          "required": false,
          "type": IQuestionTypes.SELECT_RATE,
          "minValue": 0,
          "maxValue": 5 
        },
        {
          "order": 3,
          "title": "Пример приложений",
          "description": "Приведите пример приложений, которым Вы пользуетесь, использующих ООП",
          "required": true,
          "type": IQuestionTypes.SELECT_RATE,
          "response": 1,
          "minValue": 0,
          "maxValue": 4 
        },
        {
          "order": 4,
          "title": "Пример приложений",
          "description": "Приведите пример приложений, которым Вы пользуетесь, использующих ООП",
          "required": true,
          "type": IQuestionTypes.MULTIPLE,
          "response": 'Киров',
          "responses": [
            {
              id: 1,
              response: "Вологда",
            },
            {
              id: 2,
              response: "Москва",
            },
            {
              id: 3,
              response: "Киев",
            },
            {
              id: 4,
              response: "Киров",
            }
          ],
        }
      ]
    }
  }
}
