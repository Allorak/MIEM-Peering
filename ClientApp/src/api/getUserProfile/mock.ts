import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'
import { IRole } from '../../store/types'

export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: {
      id: "jkasldjsa",
      fullname: 'Test',
      imageUrl: 'https://lh3.googleusercontent.com/a/AATXAJz60re4_yKB3-clBNjRz_cnx9X_qX2BBR3koRjF=s96-c',
      role: IRole.student,
      email: 'test@test.ru',
    }
  }
}
