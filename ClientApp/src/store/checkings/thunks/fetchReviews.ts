import { getMyReviews } from "../../../api/getMyReviews";


export const fetchReviews = async (taskId: string, accessToken: string) => {
    return await getMyReviews({ accessToken, taskId })
}