import Cookies from "universal-cookie";

import { actions } from "..";
import { paths } from "../../../app/constants/paths";
import { AppThunk } from "../../../app/store";

import { ICookiesToken } from "../../types";


export const auth = (payload: string): AppThunk => async (dispatch) => {
    dispatch(actions.authStarted())
    const cookies = new Cookies()
    cookies.remove(ICookiesToken.key, { path: paths.root })
    cookies.set(ICookiesToken.key, payload, { path: paths.root })

    dispatch(actions.authSuccess(payload))
}