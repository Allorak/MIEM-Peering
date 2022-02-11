import { getFileById } from "../../api/getFileById";

export const fetchFile = async (fileId: string, accessToken: string) => {
    return await getFileById({ fileId, accessToken })
}