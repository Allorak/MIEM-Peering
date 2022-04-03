import { IAuthorizationUserResponse, IUserAuthorizationRequest } from "../../store/types";

export type IRequestData = IUserAuthorizationRequest

export type IResponseData = IAuthorizationUserResponse

export { postAuthorizationUser } from './postAuthorizationUser';