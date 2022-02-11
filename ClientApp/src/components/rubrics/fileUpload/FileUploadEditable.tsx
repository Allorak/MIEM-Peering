import { FC, useCallback, useEffect, useMemo } from "react";
import { Box, IconButton, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { useDropzone } from 'react-dropzone'

import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { palette } from "../../../theme/colors";


interface IProps {
  value?: File
  onEdit: (value: File | undefined, id: string) => void,
  required: boolean,
  id: string
}

export const FileUploadEditable: FC<IProps> = ({
  value: file,
  onEdit,
  required,
  id
}) => {

  const {
    acceptedFiles,
    isDragAccept,
    getRootProps,
    getInputProps,
  } = useDropzone({ multiple: false, maxSize: 10000000 })

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onEdit(acceptedFiles[0], id)
    }
  }, [acceptedFiles])

  const handleDeleteFile = useCallback(() => {
    onEdit(undefined, id)
  }, [])

  const dragSx = useMemo(() => {
    return isDragAccept ? styles.dragAccept : required ? { ...styles.dragFill, borderColor: 'error.main' } : styles.dragFill
  }, [isDragAccept, required])

  const fileSize = useMemo(() => {
    if (file) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (file.size === 0) return '0 Byte';

      var i = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)).toString())
      return Math.round(file.size / Math.pow(1024, i)) + ' ' + sizes[i];

    }

    return ""
  }, [file])

  return (
    <>
      {!file ? (
        <Box
          {...getRootProps()}
          sx={dragSx}
        >
          <input
            {...getInputProps()}
            required={required}
          />
          {!isDragAccept ?
            (
              <>
                <Typography
                  variant={'body1'}
                  fontSize={'16px'}
                  fontWeight={700}
                >
                  {"Перетащите Ваш документ или нажмите, чтобы выбрать"}
                </Typography>
                <Typography
                  variant={'body2'}
                >
                  {"До 10 мегабайт"}
                </Typography>
              </>
            ) : (
              <UploadFileIcon
                sx={{
                  fontSize: '60px',
                  color: "success.main"
                }}
              />
            )
          }
        </Box>
      ) : (
        <Box sx={styles.filesWrapper}>
          <ArticleOutlinedIcon
            sx={{
              color: 'primary.main',
              fontSize: '30px'
            }}
          />

          <Typography
            variant={'body1'}
            flex={'1 1 100%'}
          >
            {`${file.name} - ${fileSize}`}
          </Typography>

          <IconButton
            title={'Удалить документ'}
            onClick={handleDeleteFile}
          >
            <DeleteOutlineOutlinedIcon
              sx={{
                color: 'error.main',
                fontSize: '30px'
              }}
            />
          </IconButton>
        </Box>
      )}
    </>
  );
}


const drag: SxProps<Theme> = {
  padding: "10px 25px",
  textAlign: "center",
  border: "3px dashed",
  borderRadius: "5px",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '80px',
  boxSizing: "border-box"
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
    gap: '5px',
    ":hover": {
      borderColor: 'common.black'
    },
    boxSizing: "border-box",
  } as SxProps<Theme>,

  dragFill: {
    ...drag,
    backgroundColor: "common.white",
    borderColor: "info.main",
    ":hover": {
      borderColor: palette.hover.success,
      cursor: "pointer"
    }
  } as SxProps<Theme>,

  dragAccept: {
    ...drag,
    backgroundColor: "#f9f9f9",
    borderColor: "success.main"
  } as SxProps<Theme>,
}