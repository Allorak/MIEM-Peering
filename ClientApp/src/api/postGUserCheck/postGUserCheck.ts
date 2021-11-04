import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'
import { mock } from './mock'


export const postGUserCheck = async (payload: IRequestData): Promise<IResponse<IResponseData>> => {

  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: `posttoken`, //сделать api
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiMzdiYTE4YS0xMTk4LTRkYTYtYTlkMi1hYjk2ODE5OGUxY2IiLCJ2YWxpZCI6IjEiLCJ1c2VyaWQiOiIxIiwibmFtZSI6ImJpbGFsIiwiZXhwIjoxNjM0ODkxMTEwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAifQ.tl7ASJY2H48lDWDZskJ--fG3SlSoZG_eY0fA_5T3pyQ`,
      'Accept-Language': 'ru',
    },
    data: payload, // можно не отправлять ????
  }

  // Типизация Response

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  console.log(response.data, "DATA")
  return response.data
}
