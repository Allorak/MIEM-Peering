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

  const handleDownloadFile = useCallback((fileId: string, fileName: string) => {
    if (fileId && accessToken) {
      fetchFile(fileId, accessToken).then(file => {
        if (file) {
          saveAs(file, fileName)
        }
      })
    }
  }, [])

  return (
    <>

      {files && files.length > 0 ? (
        <Box
          display={"flex"}
          gap={'5px'}
          flexDirection={'column'}
        >
          {files.map(item => (
            <Box
              sx={styles.filesWrapper}
            >
              <ArticleOutlinedIcon
                sx={{
                  color: 'secondary.main',
                  fontSize: '30px'
                }}
              />

              <Typography
                variant={'body1'}
                flex={'1 1 100%'}
                lineHeight={0}
                sx={styles.fileName}
                onClick={() => handleDownloadFile(item.id, item.name)}
              >
                {item.name}
              </Typography>

              <IconButton
                title={'Скачать'}
                onClick={() => handleDownloadFile(item.id, item.name)}
              >
                <FileDownloadIcon
                  sx={{
                    color: 'primary.main',
                    fontSize: '30px'
                  }}
                />
              </IconButton>
            </Box>
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

    </>
  )
}

const styles = {
  filesWrapper: {
    backgroundColor: 'common.white',
    display: 'flex',
    width: '100%',
    px: '5px',
    border: "1px solid",
    borderColor: '#e0e7ff',
    borderRadius: '10px',
    alignItems: 'center',
    gap: '15px',
    boxSizing: "border-box",
  } as SxProps<Theme>,

  fileName: {
    textDecoration: 'underline',
    ":hover": {
      cursor: 'pointer',
      color: 'primary.main'
    }
  } as SxProps<Theme>,
}