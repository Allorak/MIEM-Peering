import { getWorksList } from "../../../api/getWorksList";


export const fetchWorkList = async (taskId: string, accessToken: string) => {
    return await getWorksList({ accessToken, taskId })
}