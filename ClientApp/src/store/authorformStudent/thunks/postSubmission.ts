import { IAuthorFormResponses } from "../../types";
import { postAuthorForm } from "../../../api/postAuthorForm";


export const postSubmission = async (taskId: string, responses: IAuthorFormResponses, accessToken: string) => {
    return await postAuthorForm({ accessToken, taskId, responses })
}