import { IPeerResponses } from "../../types";
import { postReviewByTeacher } from "../../../api/postReviewByTeacher";


export const createReview = async (taskId: string, workId: string, responses: IPeerResponses, accessToken: string) => {
    return await postReviewByTeacher({ accessToken, taskId, responses, workId })
}