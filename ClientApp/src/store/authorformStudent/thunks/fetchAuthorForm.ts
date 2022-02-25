import { getAuthorform } from "../../../api/getAuthorform";


export const fetchAuthorForm = async (taskId: string, accessToken: string) => {
    return await getAuthorform({ accessToken, taskId })
}