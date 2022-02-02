import { getGradesCsv } from "../../../api/getGradesCsv";

export const fetchCsv = async (taskId: string, accessToken: string) => {
    return await getGradesCsv({ taskId, accessToken })
}