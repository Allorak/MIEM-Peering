import { getSubmissionStatus } from "../../../api/getSubmissionStatus";


export const fetchSubmissionPossibility = async (taskId: string, accessToken: string) => {
  return await getSubmissionStatus({ accessToken, taskId })
}