import { FC } from "react";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { SxProps, Theme } from "@mui/system"

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


interface IProps {
  id: number,
  title: string,
  onEdit(id: number): void,
  onRemove(id: number): void,
  onClone(id: number): void,
}

const questionTx = 'В'

export const AnswerBox: FC<IProps> = ({
  id,
  title,
  children,
  onEdit,
  onRemove,
  onClone
}) => {

  return (
    <Box sx={styles.wrapper}>
      <Box sx={styles.topContainer}>
        <Box sx={styles.container}>
          <Typography variant='body1'>
            {`${questionTx}${id + 1}`}
          </Typography>

          <Typography variant='h5'>
            {title}
          </Typography>
        </Box>

        <Box sx={styles.bodyContainer}>
          <Box sx={styles.container}>
            {children}
          </Box>
        </Box>
      </Box>

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
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    width: '100%',
    borderRadius: '4px',
    padding: '16px 0px 0px 0px',
    boxShadow: '0px 0px 3px 0px rgba(34, 60, 80, 0.2)'
  } as SxProps<Theme>,
  container: {
    margin: '0px 25px'
  } as SxProps<Theme>,
  topContainer: {
    borderBottom: theme => `solid 1px ${theme.palette.divider}`,
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
}

