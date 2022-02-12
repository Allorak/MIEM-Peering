import { FC } from "react";
import { Navigate } from "react-router-dom";

import { paths } from "../../app/constants/paths";


export const Router404: FC = () => {
  return (
    <Navigate to={paths.notFound} replace />
  )
}