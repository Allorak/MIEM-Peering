import Cookies from "universal-cookie";

import { actions } from "..";
import { AppThunk } from "../../../app/store";
import { actions as googleAuthActions } from "../../googleAuth";
import { actions as regActions } from "../../registretion"
import { actions as userProfileActions } from "../../userProfile"
import { ICookiesToken, IErrorCode } from "../../types";
import { paths } from "../../../app/constants/paths";


export const unauthorize = (): AppThunk => async (dispatch) => {

  const cookies = new Cookies()
  cookies.remove(ICookiesToken.key, { path: paths.root })

  dispatch(actions.unauth())

  dispatch(googleAuthActions.reset())
  dispatch(regActions.reset())
  dispatch(userProfileActions.userProfileRemove())
}
