import { FC } from "react";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { SxProps, Theme } from "@mui/system"

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { palette } from "../../../theme/colors";


interface IProps {
  id: number,
  title: string,
  onEdit?(id: number): void,
  onRemove?(id: number): void,
  onClone?(id: number): void,
  required: boolean,
  description?: string,
  borderColor?: string
}

const questionTx = 'В'

export const AnswerBox: FC<IProps> = ({
  id,
  title,
  children,
  description,
  onEdit,
  onRemove,
  onClone,
  required,
  borderColor = palette.fill.primary
}) => {

  const borderLeft = `3px solid ${borderColor}`

  return (
    <Box sx={{ ...styles.wrapper, borderLeft: borderLeft }}>
      <Box sx={styles.topContainer}>
        <Box sx={styles.container}>
          <Typography variant='body1'>
            {`${questionTx}${id + 1}`}
          </Typography>

          <Typography
            variant='h5'
            {...(required && { sx: styles.title })}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant={"h6"}
              sx={{ whiteSpace: 'pre-line' }}
            >
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={styles.bodyContainer}>
          <Box sx={styles.container}>
            {children}
          </Box>
        </Box>
      </Box>
      {onEdit && onRemove && onClone && (
        <Box sx={styles.actionCOntainer}>
          <Button variant='contained'
            startIcon={<EditIcon />}
            onClick={() => onEdit(id)}
            sx={styles.actionBt}
          >
            <Box
              component={'span'}
              sx={styles.actionBtLabel}
            >
              {"Изменить"}
            </Box>
          </Button>

          <Button variant='contained'
            startIcon={<ContentCopyIcon />}
            onClick={() => onClone(id)}
            sx={styles.actionBt}
          >
            <Box
              component={'span'}
              sx={styles.actionBtLabel}
            >
              {"Создать копию"}
            </Box>
          </Button>

          <Button variant='contained'
            startIcon={<DeleteIcon />}
            onClick={() => onRemove(id)}
            sx={styles.actionBt}
          >
            <Box
              component={'span'}
              sx={styles.actionBtLabel}
            >
              {"Удалить"}
            </Box>
          </Button>
        </Box>
      )}

    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    width: '100%',
    borderRadius: '4px',
    padding: '16px 0px 0px 0px',
    boxShadow: '0px 0px 3px 0px rgba(34, 60, 80, 0.2)',
    boxSizing: "border-box"
  } as SxProps<Theme>,
  container: {
    margin: '0px 25px'
  } as SxProps<Theme>,
  topContainer: {
    padding: '0px 0px 16px 0px'
  } as SxProps<Theme>,
  bodyContainer: {
    margin: '25px 0px 0px 0px'
  } as SxProps<Theme>,
  footerContainer: {
    margin: '25px 0px 0px 0px'
  } as SxProps<Theme>,
  actionBt: {
    lineHeight: '1',
    padding: '8px 12px 8px 8px',
    fontSize: '12px',
    "& .MuiButton-startIcon": {
      margin: "0px 4px 0px 0px"
    },
    "@media (max-width: 600px)": {
      minWidth: "10px",
      padding: '12px',
      "& .MuiButton-startIcon": {
        margin: "0px",
      },
    }
  } as SxProps<Theme>,
  actionCOntainer: {
    padding: '10px 25px',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: "10px",
    borderTop: theme => `solid 1px ${theme.palette.divider}`,
  } as SxProps<Theme>,
  actionBtLabel: {
    "@media (max-width: 600px)": {
      display: "none",
      opacity: 0,
      width: '0px',
      height: '0px',
      overflow: 'hidden'
    }
  } as SxProps<Theme>,
  title: {
    position: 'relative',
    display: 'inline',
    ":after": {
      content: "'*'",
      position: 'absolute',
      right: '-10px',
      bottom: '12px',
      lineHeight: '1',
      color: "common.black"
    }
  } as SxProps<Theme>,
}

