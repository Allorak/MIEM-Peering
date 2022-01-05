import { format } from "path/posix"

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
  USER_ALREADY_REGISTERED = 104
}

export type IError = {
  code: IErrorCode,
  message?: string,
}

export type IStatus = 'EMPTY' | 'FIRST_LOADING' | 'NOT_LOADED' | 'SUCCESS' | 'LOCKED'

export enum IRole {
  teacher = 'Teacher',
  student = 'Student',
  expert = 'Expert'
}

export type IPath = {
  courseId?: string,
  taskId?: string
}

export type IPathDashboard = {
  taskId?: string,
  activeMenuId?: IMenuTitles
}

export enum GoogleAuthStatus {
  newUser = "NEW",
  registeredUser = "REGISTERED"
}

export type IGoogleUserNew = {
  status: GoogleAuthStatus.newUser
}

export type IGoogleUserRegistered = {
  status: GoogleAuthStatus.registeredUser,
  user: IUserProfile,
  accessToken: string
}

export type IRegistretionRequest = {
  googleToken: string,
  role: IRole,
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

export type IUserProfile = {
  id: string,
  email: string,
  role: IRole,
  imageUrl?: string,
  fullname: string
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
  id: string
}

export type ICourses = {
  id: string,
  adminImageUrl?: string,
  adminName: string,
  name: string,
  subject: string,
  description?: string,
  settings?: IActiveCodeCourse | IDisableCodeCourse
}

export type IDashboardTaskProps = {
  userRole: IRole.teacher,
  step: PeerSteps
} | {
  userRole: IRole.student,
  step: PeerSteps
} | {
  userRole: IRole.expert,
}

export type IActiveCodeCourse = {
  enableCode: true,
  courseCode?: string
}

export type IDisableCodeCourse = {
  enableCode: false,
}

export type IResponseCourses = {
  id: string,
  teacher: {
    fullname: string,
    imageUrl?: string,
  },
  title: string,
  subject: string,
  description?: string,
  settings?: IActiveCodeCourse | IDisableCodeCourse
}

export type INewCourseRequest = {
  name: string
  subject: string
  description?: string
}

export type IUpdateCourseRequest = INewCourseRequest & {
  id: string
  settings?: IActiveCodeCourse | IDisableCodeCourse
}

export type ITaskItem = {
  id: string,
  title: string,
  description?: string
}

export type ITasks = {
  tasks: ITaskItem[]
}

export type INewTaskState = 'author-form' | 'peer-form' | 'settings' | 'main-info'

export interface INewTask {
  mainInfo: INewTaskMainInfo,
  peerForm: INewTaskPeerForm,
  authorForm: INewTaskPeerForm,
  settings: INewTaskSettings
}

export type INewTaskResponse = {
  id: string
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
  submissionStartDateTime: Date | undefined
  submissionEndDateTime: Date | undefined
  reviewStartDateTime: Date | undefined
  reviewEndDateTime: Date | undefined
  submissionsToCheck: number
  stepParams: IFirstStepSettings | ISecondStepSettings,
  type: PeerTaskTypes
}

export enum PeerSteps {
  FIRST_STEP = 'FirstStep',
  SECOND_STEP = 'SecondStep',
}

export interface IFirstStepSettings {
  step: PeerSteps.FIRST_STEP,
  experts: Array<string>
}

export interface ISecondStepSettings {
  step: PeerSteps.SECOND_STEP,
  taskId: string
}

export interface IDeadlines extends Omit<INewTaskSettings, 'submissionsToCheck' | 'stepParams' | 'type'> { }

export type IQuestionRubrics = Array<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion>

export type IParentQuestionRubric = {
  order: number
  title: string
  required: boolean
  description?: string
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
  minValue: number,
  coefficientPercentage?: number
}

export enum IQuestionTypes {
  TEXT = 'Text',
  MULTIPLE = 'Multiple',
  SELECT_RATE = 'Select',
  SHORT_TEXT = 'ShortText',
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
  EXPORT = 'Экспорт',
  AUTHORFORM = 'Сдать работу',
  WORK = 'Моя работа',
  MENU_3 = 'Меню 3'
}

export type IStatusBar = {
  total: number,
  submissions: number,
  review: number
}

export type IStatusTask = {
  count: number
}

export type IOverview = {
  statistics: IStatusBar,
  deadlines: IDeadlines,
  grades: number[]
}

export type IOverviewStudent = {
  deadlines: IDeadlines,
  status: IStatusTask
}

export type IAuthorFormResponseItem = {
  id: number,
  response: string
}
export type IOverviewExpert = {
  deadlines: IDeadlines,
  checkedWorksCount?: number,
  assignedWorksCount?: number
}

export type IOverviewResponse = IOverview & {
  deadlines: {
    submissionStartDateTime: string
    submissionEndDateTime: string
    reviewStartDateTime: string
    reviewEndDateTime: string
  }
}

export type IOverviewStudentResponse = IOverviewStudent & {
  deadlines: {
    submissionStartDateTime: string
    submissionEndDateTime: string
    reviewStartDateTime: string
    reviewEndDateTime: string
  }
}

export type IWorkItem = {
  submissionId: string,
  studentName: string
}

export type IWorks = {
  submissionsInfo: IWorkItem[]
}

export type IWorkResponse = {
  id: string,
  order: number,
  title: string,
  response?: string
}

export interface IExpertItem {
  email: string,
  name?: string,
  imgUrl?: string
  taskComplete?: number,
  assignedTasks?: number
}

export enum PeerTaskTypes {
  SINGLE_BLIND = 'singleBlind',
  DOUBLE_BLIND = 'doubleBlind',
  OPEN = 'open'
}
export interface ICatalog {
  id: string,
  name: string
}


/* Chickings */

export interface IStudentWorkItem {
  questionId: string,
  order: number,
  title: string,
  required: boolean
  response?: string
}

export interface IStudentWorkSelectItem extends Omit<IStudentWorkItem, 'response'>, ISelectRatingQuestion {
  response?: number
}

export interface IStudentWorkTextItem extends IStudentWorkItem, ITextQuestion { }

export interface IStudentWorkShortTextItem extends IStudentWorkItem, IShortTextQuestion { }

export interface IStudentWorkMultipleItem extends IStudentWorkItem, IMultipleQuiestion { }

export type IStudentWork = {
  responses: Array<IStudentWorkSelectItem | IStudentWorkTextItem | IStudentWorkShortTextItem | IStudentWorkMultipleItem>
}

export interface IPeerFormItem {
  id: string,
  order: number,
  required: boolean,
  title: string,
  response?: string
}

export interface IPeerFormSelectItem extends Omit<IPeerFormItem, 'response'>, ISelectRatingQuestion {
  response?: number
}

export interface IPeerFormTextItem extends IPeerFormItem, ITextQuestion { }

export interface IPeerFormShortTextItem extends IPeerFormItem, IShortTextQuestion { }

export interface IPeerFormMultipleItem extends IPeerFormItem, IMultipleQuiestion { }


export type IPeerForm = {
  rubrics: Array<IPeerFormSelectItem | IPeerFormTextItem | IPeerFormShortTextItem | IPeerFormMultipleItem>
}

export type IMyWorkForm = {
  answers: Array<IStudentWorkSelectItem | IStudentWorkTextItem | IStudentWorkShortTextItem | IStudentWorkMultipleItem>
}

export type IMyWorkReviewsItem = {
  reviewer: IRole,
  reviewerName: string,
  submissionId: string,
  finalGrade: number,
  answers: Array<IStudentWorkSelectItem | IStudentWorkTextItem | IStudentWorkShortTextItem | IStudentWorkMultipleItem>
}

export type IMyWorkReviews = Array<IMyWorkReviewsItem>

export type IPeerResponseItem = {
  questionId: string,
  response?: string | number
}

export type IPeerResponses = {
  responses: Array<IPeerResponseItem>
}

export enum Reviewers {
  TEACHER = 'teacher',
  PEER = 'peer',
  EXPERT = 'expert'
}

export enum WorkGraphTypes {
  FINAL = "finalRates",
  CRITERIA = "criteria"
}

export enum WorkStatisticsTypes {
  GRAPH = "graph",
  RESPONSE = "response"
}

export interface IWorkGraphByCriteriaItem {
  title: string
  graphType: WorkGraphTypes.CRITERIA
}

export interface IWorkGraphFinalRatesItem {
  graphType: WorkGraphTypes.FINAL
}

export interface IWorkReviewСoordinates {
  value: number
  reviewer: Reviewers
  name: string
}

export type IWorkGraphPropsItem = {
  statisticType: WorkStatisticsTypes.GRAPH,
  coordinates: IWorkReviewСoordinates[],
  minGrade: number,
  maxGrade: number
}

export interface IWorkGraphByCriteria extends IWorkGraphByCriteriaItem, IWorkGraphPropsItem { }

export type IWorkGraphFinalRates = IWorkGraphFinalRatesItem & IWorkGraphPropsItem

export type IWorkGraph = IWorkGraphByCriteria | IWorkGraphFinalRates

export type IWorkReviewerForm = IStudentWork & {
  statisticType: WorkStatisticsTypes.RESPONSE,
  name: string,
  reviewer: Reviewers
}

export type IWorkStatistics = Array<IWorkGraph | IWorkReviewerForm>

/* Author form */

export interface IAuthorForm extends IPeerForm { }

export enum ISubmissionStatus {
  COMPLETED = 'Completed',
  NOT_COMPLETED = 'NotCompleted'
}

export interface IAuthorFormResponses extends IPeerResponses { }

export enum DeadlineStatus {
  START = 'Start',
  END = 'End',
  NOT_STARTED = 'NotStarted'
}