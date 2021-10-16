import { FC } from "react";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { SxProps, Theme } from "@mui/system"

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


interface IProps {
  id: string,
  num: number,
  title?: string,
  onEdit(id: string): void,
  onRemove(id: string): void,
  onClone(id: string): void,
}

const questionTx = 'В'

export const AnswerBox: FC<IProps> = ({
  id,
  num,
  title = 'Вопрос',
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
            {`${questionTx}${num}`}
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
        <Box sx={styles.bodyContainer}>
          <Box sx={styles.container}>
            <Box sx={styles.actionCOntainer}>
              <Button variant='contained'
                startIcon={<EditIcon />}
                onClick={() => onEdit(id)}
                sx={styles.actionBt}
              >
                Изменить
              </Button>

              <Button variant='contained'
                startIcon={<ContentCopyIcon />}
                onClick={() => onClone(id)}
                sx={styles.actionBt}
              >
                Создать копию
              </Button>

              <Button variant='contained'
                startIcon={<DeleteIcon />}
                onClick={() => onRemove(id)}
                sx={styles.actionBt}
              >
                Удалить
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    width: '100%',
    borderRadius: '4px',
    padding: '16px 0px 30px 0px'
  } as SxProps<Theme>,
  container: {
    margin: '0px 25px 0px 25px'
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
    padding: '8px',
    fontSize: '12px'
  } as SxProps<Theme>,
  actionCOntainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  } as SxProps<Theme>,
}

