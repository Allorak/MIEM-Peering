import { getReviewDeadlineStatus } from "../../../api/getReviewDeadlineStatus";


export const fetchReviewStatus = async (taskId: string, accessToken: string) => {
    return await getReviewDeadlineStatus({ accessToken, taskId })
}