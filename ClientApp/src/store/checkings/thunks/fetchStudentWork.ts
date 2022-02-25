import { getStudentWork } from "../../../api/getStudentWork";

export const fetchStudentWork = async (taskId: string, workId: string, accessToken: string) => {
  return await getStudentWork({ accessToken, taskId, workId })
}