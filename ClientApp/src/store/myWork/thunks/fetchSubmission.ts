import { getMyWork } from "../../../api/getMyWork";


export const fetchSubmission = async (submissionId: string, accessToken: string,) => {
    return await getMyWork({ accessToken, submissionId })
}