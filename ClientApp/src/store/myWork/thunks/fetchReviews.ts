import { getMyWorkReviews } from "../../../api/getMyWorkReviews";


export const fetchReviews = async (taskId: string, accessToken: string) => {
    return await getMyWorkReviews({ accessToken, taskId })
}