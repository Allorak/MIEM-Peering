import { getGradesExel } from "../../../api/getGradesExel";

export const fetchExel = async (taskId: string, accessToken: string) => {
    return await getGradesExel({ taskId, accessToken })
}