import { getSubmissionIdForStrudent } from "../../../api/getSubmissionIdForStrudent";


export const fetchSubmissionId = async (taskId: string, accessToken: string) => {
    return await getSubmissionIdForStrudent({ accessToken, taskId })
}