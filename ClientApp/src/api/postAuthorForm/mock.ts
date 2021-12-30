import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(1500)

  return {
    success: true,
    payload: {
      responses: [
        {"questionId":"0","response":"stte"},
        {"questionId":"1","response":"st"},
        {"questionId":"2"},
        {"questionId":"3","response":1},
        {"questionId":"4","response":"Киров"}
      ],
      taskId: "bb7aa851-bed9-4fd4-a593-7ae856a9f9d9"
    }
  }
}
