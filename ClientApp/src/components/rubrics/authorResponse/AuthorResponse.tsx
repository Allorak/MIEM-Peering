import { FC } from "react";
import { Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";


interface IProps {
  response?: string
}

export const AuthorResponse: FC<IProps> = ({ response }) => {
  return (
    response ? (
      <Typography
        variant={"h6"}
        sx={styles.response}
      >
        {response}
      </Typography>
    ) : (
      <Typography
        variant={"body1"}
        sx={styles.noResponse}
      >
        {"Нет ответа"}
      </Typography>
    )
  )
}

const styles = {
  response: {
    fontStyle: "italic"
  } as SxProps<Theme>,
  noResponse: {
    color: "error.main",
    fontWeight: 700
  } as SxProps<Theme>,

}