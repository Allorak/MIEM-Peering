import { FC, useCallback } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import { saveAs } from 'file-saver';

import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { useAppSelector } from "../../../app/hooks";

import { fetchFile } from "../../../store/downloadFile";

import { IFileInputItem } from "../../../store/types";


interface IProps {
  files?: IFileInputItem[]
}

export const FileUploadVisible: FC<IProps> = ({ files }) => {
  const accessToken = useAppSelector(state => state.auth.accessToken)

  const handleDownloadFile = useCallback((fileId: string) => {
    if (fileId && accessToken) {
      fetchFile(fileId, accessToken).then(blob => {
        if (blob) {
          saveAs(blob)
        }
      })
    }
  }, [])

  return (
    <Box sx={styles.filesWrapper}>

      {files && files.length > 0 ? (
        <Box>
          {files.map(item => (
            <>
              <ArticleOutlinedIcon
                sx={{
                  color: 'secondary.main',
                  fontSize: '30px'
                }}
              />

              <Typography
                variant={'body1'}
                flex={'1 1 100%'}
              >
                {item.name}
              </Typography>

              <IconButton
                title={'Скачать'}
                onClick={() => handleDownloadFile(item.id)}
              >
                <FileDownloadIcon
                  sx={{
                    color: 'primary.main',
                    fontSize: '30px'
                  }}
                />
              </IconButton>
            </>
          ))}

        </Box>
      ) : (
        <>
          <ErrorOutlineIcon
            sx={{
              color: 'warning.main',
              fontSize: '30px'
            }}
          />

          <Typography
            variant={'body1'}
            flex={'1 1 100%'}
          >
            {`Файл не обнаружен`}
          </Typography>
        </>
      )}

    </Box>
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