import { FC } from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';


export const FileUploadPreview: FC = () => {
  return (
    <Tooltip
      title={"Это всего лишь предварительный просмотр"}
      placement={"top"}
    >
      <Box sx={styles.filesWrapper}>
        <BackupOutlinedIcon
          sx={{
            color: 'primary.main',
            fontSize: '30px'
          }}
        />

        <Typography
          variant={'body1'}
          flex={'1 1 100%'}
        >
          {`Загрузка файла (до 10 мегабайт)`}
        </Typography>
      </Box>
    </Tooltip>
  )
}

const styles = {
  filesWrapper: {
    backgroundColor: 'common.white',
    display: 'flex',
    width: '100%',
    minHeight: '50px',
    padding: '10px',
    border: "1px solid",
    borderColor: '#e0e7ff',
    borderRadius: '10px',
    alignItems: 'center',
    gap: '15px',
    ":hover": {
      borderColor: 'common.black'
    },
    boxSizing: "border-box",
  } as SxProps<Theme>,
}