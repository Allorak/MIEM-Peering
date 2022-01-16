import { FC } from "react";

import { Box, SxProps, Theme } from "@mui/system";
import { Typography } from "@mui/material";

import { OpenPeer } from "../icons/OpenPeer";
import { DoubleBlind } from "../icons/DoubleBlind";
import { SingleBlind } from "../icons/SingleBlind";

import { PeerTaskTypes } from "../../store/types";

interface IProps {
  type: PeerTaskTypes
}

export const TaskTypeBlock: FC<IProps> = ({
  type
}) => {
  let typeDescription: string | undefined
  let typeName: string | undefined
  let typeIcon: JSX.Element | undefined

  switch (type) {
    case 'singleBlind':
      typeIcon = <SingleBlind />
      typeDescription = 'Имена рецензентов скрыты от автора. Анонимность рецензента позволяет принимать решения, справедливость которых не зависит от влияния автора.'
      typeName = 'Одностороннее «слепое»'
      break;
    case 'doubleBlind':
      typeIcon = <DoubleBlind />
      typeDescription = 'Анонимными остаются и автор, и рецензент. Анонимность автора позволяет избежать предвзятости со стороны рецензента.'
      typeName = 'Двойное «слепое»'
      break;
    case 'open':
      typeIcon = <OpenPeer />
      typeDescription = 'Личности автора и рецензентов известны всем участникам. Некоторые ученые считают, что такое рецензирование – лучший способ избежать жестких комментариев, предотвратить плагиат, пресечь желание рецензента быстрее выполнить свой план работы и получить открытую, честную рецензию.'
      typeName = 'Открытое'
      break;
  }

  return (
    <Box sx={styles.wrapper}>
      <Typography variant={'h6'}>
        {"Тип проверки"}
      </Typography>
      <Box>
        {typeIcon && typeDescription && typeName && (
          <Box>
            <Box sx={styles.cardHeader}>
              <Box sx={styles.typeIcon}>
                {typeIcon}
              </Box>
              <Box>
                <Typography variant='body1' sx={{ ...styles.typeNameColor, ...styles.typeName }}>
                  {typeName}
                </Typography>
              </Box>
            </Box>
            <Box sx={styles.cardBody}>
              <Box sx={styles.hrBlock}></Box>
              <Typography variant={'body1'}>
                {typeDescription}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box >
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    height: "100%",
    boxSizing: "border-box",
    flexDirection: 'column',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    gap: "10px"
  } as SxProps<Theme>,
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '12px'
  } as SxProps<Theme>,
  cardBody: {

  } as SxProps<Theme>,
  typeName: {
    overflow: 'hidden',
    display: 'block',
    whiteSpace: 'nowrap',
    borderRadius: '4px',
    padding: '0 12px'
  } as SxProps<Theme>,
  typeNameColor: {
    color: theme => theme.palette.primary.main,
    backgroundColor: '#EBECFC',
  } as SxProps<Theme>,
  typeIcon: {
    display: 'flex',
    justifyContent: 'center',
    width: '200px',
    margin: '15px 0',
    flexShrink: 0
  } as SxProps<Theme>,
  hrBlock: {
    width: '15px',
    height: '1px',
    backgroundColor: '#2DCA8C',
    margin: '15px 0'
  } as SxProps<Theme>,
}