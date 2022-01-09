import { FC } from "react";
import { Box, Theme, Typography } from "@mui/material"
import { SxProps } from "@mui/system"
import AccessTimeIcon from '@mui/icons-material/AccessTime';


interface IProps {
  label: string
}

export const AccessTime: FC<IProps> = ({ label }) => {
  return (
    <Box sx={styles.container}>
      <AccessTimeIcon
        fontSize={"inherit"}
        color={'inherit'}
      />
      <Typography
        variant={"h5"}
        color={"inherit"}
      >
        {label}
      </Typography>
    </Box>
  )
}

const styles = {
  container: {
    margin: "50px 0px 0px 0px",
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    gap: "10px",
    flexDirection: "column",
    color: "#A4ADC8",
    fontSize: "58px"
  } as SxProps<Theme>,
}