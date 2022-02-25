import { getCheckingsWorkList } from "../../../api/getCheckingsWorkList";


export const fetchCheckingsWorkList = async (taskId: string, accessToken: string) => {
    return await getCheckingsWorkList({ accessToken, taskId })
}