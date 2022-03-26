/** Errors && Work Box */

export enum IErrorCode {
  EXCEPTION = -2,
  UNKNOWN = -1,
  REQUEST = 1,
  RESPONSE = 2,
  NO_ACCESS = 100,
  BAD_REQUEST_DATA = 101,
  NEED_FORCE = 102,
  OPERATION_ERROR = 103,
  USER_ALREADY_REGISTERED = 104
}

export type IError = {
  code: IErrorCode,
  message?: string,
}

export type IStatus = 'EMPTY' | 'FIRST_LOADING' | 'NOT_LOADED' | 'SUCCESS' | 'LOCKED'

/** User Roles */

export enum IRole {
  teacher = 'Teacher',
  student = 'Student',
  expert = 'Expert'
}

/** Redux Path */

export type IPath = {
  courseId?: string,
  taskId?: string
}

export type IPathDashboard = {
  taskId?: string,
  activeMenuId?: IMenuTitles
}

/** Google Auth States */

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

/** Cookies token */

export enum ICookiesToken {
  key = "JWT",
}

/** Identity Status */

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

/** User Profile */

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

/** Courses */

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
  taskType: PeerSteps
} | {
  userRole: IRole.student,
  taskType: PeerSteps
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
  rubrics: INewQuestionRubrics
}

export interface INewTaskSettings {
  submissionStartDateTime: Date | undefined
  submissionEndDateTime: Date | undefined
  reviewStartDateTime: Date | undefined
  reviewEndDateTime: Date | undefined
  submissionsToCheck: number
  experts?: Array<string>
  reviewType: PeerTaskTypes
  submissionWeight: number
  reviewWeight: number
  ltiEnable: boolean
  goodConfidenceBonus?: number
  badConfidencePenalty?: number
}

export enum PeerSteps {
  FIRST_STEP = 'Initial',
  SECOND_STEP = 'Common',
}

export interface IDeadlines extends Omit<INewTaskSettings, 'ltiEnable' | 'submissionsToCheck' | 'reviewType' | 'experts' | 'submissionWeight' | 'reviewWeight' | 'goodCoefficientBonus' | 'badCoefficientPenalty'> { }

export type INewQuestionRubrics = Array<INewTextQuestion | INewShortTextQuestion | INewMultipleQuiestion | INewSelectRatingQuestion | INewUploadFileQuestion>

export type INewQuestionItem = {
  order: number
  title: string
  required: boolean
  description?: string
}

export interface INewTextQuestion extends INewQuestionItem {
  type: IQuestionTypes.TEXT,
}

export interface INewUploadFileQuestion extends INewQuestionItem {
  type: IQuestionTypes.FILE,
}

export interface INewShortTextQuestion extends INewQuestionItem {
  type: IQuestionTypes.SHORT_TEXT,
}

export interface INewMultipleQuiestion extends INewQuestionItem {
  type: IQuestionTypes.MULTIPLE,
  responses: IMultipleResponse[]
}

export interface INewSelectRatingQuestion extends INewQuestionItem {
  type: IQuestionTypes.SELECT_RATE,
  maxValue: number,
  minValue: number,
  coefficientPercentage?: number
}

export type IQuestionItem = INewQuestionItem & {
  questionId: string
}

export interface ITextQuestion extends IQuestionItem, INewTextQuestion {
  response?: string
}

export interface IShortTextQuestion extends IQuestionItem, INewShortTextQuestion {
  response?: string
}

export interface IMultipleQuiestion extends IQuestionItem, INewMultipleQuiestion {
  value?: number
}

export interface ISelectRatingQuestion extends IQuestionItem, INewSelectRatingQuestion {
  value?: number
}

export interface IFileInputItem {
  id: string
  name: string
}

export interface IUploadFileQuestion extends IQuestionItem, INewUploadFileQuestion {
  file?: File[],
  files?: IFileInputItem[]
}

export type IQuestionRubrics = Array<ITextQuestion | IShortTextQuestion | IMultipleQuiestion | ISelectRatingQuestion | IUploadFileQuestion>

export enum IQuestionTypes {
  TEXT = 'Text',
  MULTIPLE = 'Multiple',
  SELECT_RATE = 'Select',
  SHORT_TEXT = 'ShortText',
  FILE = 'File'
}

export const defaultResponses = {
  rateResponses: {
    maxValue: 10,
    minValue: 0
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
  AUTHORFORM = 'Сдать работу',
  WORK = 'Моя работа',
  MENU_3 = 'Меню 3'
}

export type IStatusBar = {
  submissions?: number
  totalSubmissions?: number
  reviews?: number
  totalReviews?: number
}

export type IStatusTask = {
  assignedSubmissions: number,
  reviewedSubmissions: number
}

export interface IFinalGradeItemOverview {
  student: string,
  value: number
}

export interface IConfidenceFactorItemOverview extends IFinalGradeItemOverview {
  category: string
}

export type IOverview = {
  statistics: IStatusBar,
  deadlines: IDeadlines,
  grades?: IFinalGradeItemOverview[],
  reviewType: PeerTaskTypes,
  confidenceFactors?: IFinalGradeItemOverview[],
  currentConfidenceFactors?: IFinalGradeItemOverview[],
  taskType: PeerSteps,
  submissionWeight: number,
  reviewWeight: number,
  badConfidencePenalty?: number,
  goodConfidenceBonus?: number,
  title: string,
  description?: string,
  ltiSharedSecret?: string,
  ltiConsumerKey?: string
}

export type IOverviewStudent = {
  deadlines: IDeadlines,
  assignedSubmissions?: number,
  reviewedSubmissions?: number
  submissionStatus?: boolean,
  studentGrades?: IStudentSubmissionGrades,
  taskType: PeerSteps,
  studentConfidenceFactors?: {
    before?: number,
    after?: number
  },
  submissionGrade?: number,
  reviewGrade?: number,
  finalGrade?: number,
  submissionWeight: number,
  reviewWeight: number,
  badConfidencePenalty?: number,
  goodConfidenceBonus?: number,
  title: string,
  description?: string,
}

export type IStudentSubmissionGrades = {
  coordinates: IWorkReviewСoordinates[],
  minGrade: number,
  maxGrade: number
}

export type IOverviewExpert = {
  deadlines: IDeadlines,
  assignedSubmissions?: number,
  reviewedSubmissions?: number,
  title: string,
  description?: string,
}

export interface IOverviewExpertResponse extends Omit<IOverviewExpert, 'deadlines'> {
  deadlines: {
    submissionStartDateTime: string
    submissionEndDateTime: string
    reviewStartDateTime: string
    reviewEndDateTime: string
  }
}


export interface IOverviewResponse extends Omit<IOverview, 'deadlines'> {
  deadlines: {
    submissionStartDateTime: string
    submissionEndDateTime: string
    reviewStartDateTime: string
    reviewEndDateTime: string
  }
}

export interface IOverviewStudentResponse extends Omit<IOverviewStudent, 'deadlines'> {
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

export interface IExpertItem {
  email: string,
  name?: string,
  imageUrl?: string
  tasksAssigned?: number,
  tasksCompleted?: number
}

export enum PeerTaskTypes {
  SINGLE_BLIND = 'SingleBlind',
  DOUBLE_BLIND = 'DoubleBlind',
  OPEN = 'Open'
}
export interface ICatalog {
  id: string,
  name: string
}

/* Chickings */

export type IStudentWork = {
  responses: IQuestionRubrics
}

export type IMyReviewsItem = {
  studentName: string,
  submissionId: string,
  answers: IQuestionRubrics,
  expertAnswers?: IQuestionRubrics,
  teacherAnswers?: IQuestionRubrics
}

export type IMyReviews = Array<IMyReviewsItem>

export type IPeerForm = {
  rubrics: IQuestionRubrics
}

export type IMyWorkForm = {
  answers: IQuestionRubrics
}

export type IMyWorkReviewsItem = {
  reviewer: IRole,
  reviewerName: string,
  reviewId: string,
  finalGrade: number,
  answers: IQuestionRubrics
}

export type IMyWorkReviews = Array<IMyWorkReviewsItem>

export type IQuestionAnswerItem = {
  questionId: string,
  response?: string | number
  value?: string | number
  file?: File[]
}

export type IQuestionAnswers = Array<IQuestionAnswerItem>

export type IPeerResponses = {
  answers: IQuestionAnswers
}

export enum Reviewers {
  TEACHER = 'Teacher',
  PEER = 'Peer',
  EXPERT = 'Expert'
}

export enum WorkGraphTypes {
  FINAL = "FinalGrades",
  CRITERIA = "Criteria"
}

export enum WorkStatisticsTypes {
  GRAPH = "Graph",
  RESPONSE = "Response"
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

export enum ReviewQualities {
  BAD = "Bad",
  DECENT = "Decent",
  GOOD = "Good",
  NOT_REVIEWED = "NotReviewed"
}

export interface IGrades {
  fullname: string
  email: string
  imageUrl?: string
  previousConfidenceFactor: number
  nextConfidenceFactor?: number
  submitted: boolean,
  assignedSubmissions?: number,
  reviewedSubmissions?: number
  teacherReviewed: boolean
  finalGrade?: number
  reviewQuality?: ReviewQualities,
  confidenceComment?: string,
  gradeComment?: string,
  reviewGrade?: number,
  submissionGrade?: number,
  joinedByLti: boolean,
  receivedLtiGrade: boolean
}