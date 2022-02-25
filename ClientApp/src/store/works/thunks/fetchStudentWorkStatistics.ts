import { getStudentWorkStatistics } from "../../../api/getStudentWorkStatistics";


export const fetchStudentWorkStatistics = async (taskId: string, workId: string, accessToken: string) => {
  return await getStudentWorkStatistics({ accessToken, taskId, workId })
}