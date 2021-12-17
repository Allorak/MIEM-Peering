import { AxiosRequestConfig } from 'axios'
import { IResponseData } from '.'
import { delay, IResponse } from '..'


export const mock = async (requestConfig: AxiosRequestConfig): Promise<IResponse<IResponseData>> => {
  await delay(500)

  return {
    success: true,
    payload: [
      {
        id: '1',
        teacher: {
          fullname: "HHHH",
        },
        title: 'Решение уравнений',
        subject: 'Математика',
        description: "Master Angular 5 from the basics to building an advanced application with Firebase's Firestore as well",
        settings: {
          enableCode: true,
          code: "GhTk3Ls"
        },
      },
      {
        id: '2',
        teacher: {
          fullname: "HHHH",
          imageUrl: 'https://lh3.googleusercontent.com/a/AATXAJz60re4_yKB3-clBNjRz_cnx9X_qX2BBR3koRjF=s96-c'
        },
        title: 'Codeigniter',
        subject: 'English',
        description: "Learn Php Codeigniter and understand working with MVC and HMVC from zero to hero",
        settings: {
          enableCode: false,
        },
      },
    ]
  }
}