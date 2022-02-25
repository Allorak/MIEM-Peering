import { getSubmissionDeadlineStatus } from "../../../api/getSubmissionDeadlineStatus";


export const fetchSubmissionStatus = async (taskId: string, accessToken: string) => {
    return await getSubmissionDeadlineStatus({ accessToken, taskId })
}