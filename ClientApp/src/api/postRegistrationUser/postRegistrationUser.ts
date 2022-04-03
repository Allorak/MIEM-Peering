import { AxiosRequestConfig } from 'axios'
import { IRequestData, IResponseData } from '.'
import { api, IResponse } from '..'


export const postRegistrationUser = async ({
  email,
  password,
  fullname,
  role,
  img
}: IRequestData): Promise<IResponse<IResponseData>> => {

  const formData = new FormData()

  formData.append('email', email)
  formData.append('password', password)
  formData.append('fullname', fullname)
  formData.append('role', role)

  if (img) {
    formData.append('img', img, `${email} ${img.name}`)
  }


  const requestConfig: AxiosRequestConfig = {
    method: 'POST',
    url: '/api/v1/users/add-native',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }

  const response = await api.request<IResponse<IResponseData>>(requestConfig)
  return response.data
}
