import { getCheckingsPeerForm } from "../../../api/getCheckingsPeerForm";


export const fetchPeerForm = async (taskId: string, accessToken: string) => {
    return await getCheckingsPeerForm({ accessToken, taskId })
}