export interface IEmployee {
  id: string | undefined
  fullName: string
  email: string
  mobile: string
  city: string | undefined
  gender: 'male' | 'female' | 'genderqueer'
  departmentId: number | undefined
  hireDate: Date | undefined
  isPermanent: boolean
}

export enum IErrorCode {
  EXCEPTION = -2, // внутренняя ошибка
  UNKNOWN = -1, // неизвестная внутренняя ошибка
  REQUEST = 1,
  RESPONSE = 2,
  NO_ACCESS = 100,
  BAD_REQUEST_DATA = 101,
  NEED_FORCE = 102, // пользователь может повторить запрос с параметром isForced: true
  OPERATION_ERROR = 103, // ошибка при выполнении операции
}

export type IError = {
  code: IErrorCode,
  message?: string,
}

export type IStatus = 'EMPTY' | 'FIRST_LOADING' | 'NOT_LOADED' | 'SUCCESS' | 'LOCKED'

export type IRole = 'teacher' | 'student';

export type IPath = {
  courseId?: string,
  taskId?: string
}

export type IPathDashboard = {
  taskId?: string,
  activeMenuId?: IMenuTitles
}

export type IGAuthCheckUser = {
  userState: 'NEW' | 'REGISTERED'
}

export type IUserGAuth = {
  email: string,
  gAccessToken: string
}

export type IRegistretionRequest = {
  email: string,
  gAccessToken?: string,
  role: IRole,
  pass?: string,
  imageUrl?: string,
  firstName: string,
  lastName: string
}

export type IRegistretionProps = {
  email: string,
  gAccessToken: string,
  role?: IRole,
  pass?: string,
  imageUrl?: string,
  firstName: string,
  lastName: string
}

export type iGoogleAuthResponse = {
  email: string,
  gAccessToken: string,
  imageUrl: string,
  firstName: string,
  lastName: string
}

export type IRegistrationResponse = {
  accessToken: string
}

// в будущем использовать для пользователя

export type IUserProfile = {
  email: string,
  role: IRole,
  imageUrl?: string,
  firstName: string,
  lastName: string
}

export type IAuthRequest = {
  gAccessToken?: string,
  pass?: string,
  email: string
}

export type IAuthResponse = {
  accessToken: string | undefined,
}

export type ICourse = {
  courseId: string
}

export type ICourses = {
  id: string,
  adminImageUrl?: string,
  adminName: string,
  name: string,
  subject: string,
  description?: string,
}

export type INewCourseRequest = {
  name: string
  subject: string
  description?: string
}


export type ITaskItem = {
  id: string,
  title: string,
  description?: string
}

export type INewTaskState = 'author-form' | 'peer-form' | 'settings' | 'main-info'

export interface INewTask {
  mainInfo: INewTaskMainInfo,
  peerForm: INewTaskPeerForm,
  authorForm: INewTaskPeerForm,
  settings: INewTaskSettings
}

export type INewTaskResponse = {
  newTaskId: string
}
export interface INewTaskMainInfo {
  title: string
  description?: string
}

export interface INewTaskAuthorForm {
}

export interface INewTaskPeerForm {
  rubrics: IQuestionRubrics
}

export interface INewTaskSettings {
  sBegin: Date | undefined
  sEnd: Date | undefined
  rBegin: Date | undefined
  rEnd: Date | undefined
  maxSubmission: number
}

export interface IDeadlines extends Omit<INewTaskSettings, 'maxSubmission'>{}

export type IQuestionRubrics = Array<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion>

export type IParentQuestionRubric = {
  id: number
  title: string
  required: boolean
}

export interface ITextQuestion extends IParentQuestionRubric {
  type: IQuestionTypes.TEXT
}

export interface IShortTextQuestion extends IParentQuestionRubric {
  type: IQuestionTypes.SHORT_TEXT
}

export interface IMultipleQuiestion extends IParentQuestionRubric {
  type: IQuestionTypes.MULTIPLE,
  responses: IMultipleResponse[]
}

export interface ISelectRatingQuestion extends IParentQuestionRubric {
  type: IQuestionTypes.SELECT_RATE,
  maxValue: number,
  minValue: number
}

export enum IQuestionTypes {
  TEXT = 'text',
  MULTIPLE = 'multiple',
  SELECT_RATE = 'select',
  SHORT_TEXT = 'short-text',
}

export const defaultResponses = {
  rateResponses: {
    maxValue: 10,
    minValue: 1
  },
  multiple: [
    {
      id: 0,
      response: "Вариант 1"
    },
    {
      id: 1,
      response: "Вариант 2"
    },
    {
      id: 3,
      response: "Вариант 3"
    },
    {
      id: 4,
      response: "Вариант 4"
    }
  ] as IMultipleResponse[]
}

export interface IMultipleResponse {
  id: number,
  response: string
}


export type IMenu = {
  title: IMenuTitles,
  path: string
}

export enum IMenuTitles {
  OVERVIEW = 'Обзор',
  WORKS = 'Работы',
  CHECKINGS = 'Проверки',
  EXPERTS = 'Эксперты',
  GRADES = 'Успеваемость',
  EXPORT = 'Экспорт'
}

export type IStatusBar = {
  total: number,
  submissions: number,
  review: number
}

export type IOverview = {
  statistics: IStatusBar,
  deadlines: IDeadlines,
  grades: number[]
}