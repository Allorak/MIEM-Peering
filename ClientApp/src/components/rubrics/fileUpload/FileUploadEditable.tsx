import { FC, useCallback, useEffect, useMemo } from "react";
import { Box, Button, IconButton, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDropzone } from 'react-dropzone'

import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

import { palette } from "../../../theme/colors";


interface IProps {
  value?: File[]
  onEdit: (value: File[] | undefined, id: string) => void,
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
  } = useDropzone({ multiple: true, maxSize: 10000000 })

  useEffect(() => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(item => item)
      if (file && file.length > 0) {
        onEdit(newFiles.concat(file).map(item => item), id)
      } else {
        onEdit(newFiles.map(item => item), id)
      }
    }
  }, [acceptedFiles])

  const handleDeleteFile = useCallback((currentFile: File) => {
    if (file && file.length > 0) {
      const newFiles = file.map(item => item)
      const filteredArray = newFiles.filter(item => item !== currentFile)
      console.log(filteredArray)
      onEdit(filteredArray.length > 0 ? filteredArray.map(item => item) : undefined, id)
      return
    }
    onEdit(undefined, id)
  }, [file, id])

  const dragSx = useMemo(() => {
    return isDragAccept ? styles.dragAccept : required ? { ...styles.dragFill, borderColor: 'error.main' } : styles.dragFill
  }, [isDragAccept, required])

  const fileSize = useCallback((currentFile: File) => {
    if (currentFile) {
      var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

      if (currentFile.size === 0) return '0 Byte';

      var i = parseInt(Math.floor(Math.log(currentFile.size) / Math.log(1024)).toString())
      return Math.round(currentFile.size / Math.pow(1024, i)) + ' ' + sizes[i];

    }

    return ""
  }, [])

  return (
    <>
      {(!file || file.length === 0) ? (
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
        <>
          <Box
            display={"flex"}
            flexDirection={"column-reverse"}
            gap={"5px"}
          >
            {file.map(item => (
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
                  {`${item.name} - ${fileSize(item)}`}
                </Typography>

                <IconButton
                  title={'Удалить документ'}
                  onClick={() => handleDeleteFile(item)}
                >
                  <DeleteOutlineOutlinedIcon
                    sx={{
                      color: 'error.main',
                      fontSize: '30px'
                    }}
                  />
                </IconButton>
              </Box>
            ))}


          </Box>
          <IconButton
            title={'Добавить'}
            onClick={getRootProps().onClick}
            color={'secondary'}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </>
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
    px: '5px',
    border: "1px solid",
    borderColor: '#e0e7ff',
    borderRadius: '10px',
    alignItems: 'center',
    gap: '5px',
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