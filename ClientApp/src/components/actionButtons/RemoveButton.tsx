import { IconButton, IconButtonProps } from "@mui/material";
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { FC } from "react";

interface IProps extends IconButtonProps {

}

export const RemoveButton: FC<IProps> = (props) => {
  return (
    <IconButton
      color="error"
      component="span"
      aria-label={'delete'}
      {...props}
    >
      <DeleteOutlinedIcon />
    </IconButton>
  )
}