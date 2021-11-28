import { IGoogleUserRegistered, IGoogleUserNew } from "../../store/types";

export type IRequestData = {
  googleToken: string
}

export type IResponseData = IGoogleUserRegistered | IGoogleUserNew

export { postGUserCheck } from './postGUserCheck';