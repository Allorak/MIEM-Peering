import { FC } from "react";
import { Typography, Box, useMediaQuery, FormControl, Select, MenuItem } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { IWorkItem } from "../../store/types";
import { scrollStyles } from "../../const/styles";


interface IProps {
  worksCatalog: IWorkItem[]
  activeWorkId: string
  onWorkChange(workId: string): void
}

export const WorksList: FC<IProps> = ({
  activeWorkId,
  onWorkChange,
  worksCatalog
}) => {

  const matches = useMediaQuery('(max-width:899px)');

  return (
    <Box sx={styles.wrapper}>
      {!matches && (
        worksCatalog.map((work, index) => (
          <Box
            key={work.submissionId}
            sx={work.submissionId === activeWorkId ? { ...styles.itemContainer, ...styles.activeItem } : { ...styles.itemContainer, ...styles.unActiveItem }}
            onClick={() => onWorkChange(work.submissionId)}
          >
            <Typography variant={'h6'} color={'inherit'}>
              {`${index + 1}. ${work.studentName}`}
            </Typography>
          </Box>
        ))
      )}

      {matches && (
        <FormControl fullWidth >
          <Select
            value={activeWorkId}
            onChange={(e) => { onWorkChange(e.target.value) }}
          >
            {worksCatalog.map((work, index) => (
              <MenuItem
                key={index}
                value={work.submissionId}
              >
                {`${index + 1}. ${work.studentName}`}
              </MenuItem>
            ))}

          </Select>
        </FormControl>
      )}
    </Box>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxHeight: "calc(100vh - 145px)",
    overflowY: 'auto',
    ...scrollStyles
  } as SxProps<Theme>,
  itemContainer: {
    borderRadius: '4px',
    padding: '15px 20px'
  } as SxProps<Theme>,
  activeItem: {
    backgroundColor: "primary.main",
    color: "common.white"
  } as SxProps<Theme>,
  unActiveItem: {
    backgroundColor: "common.white",
    color: "common.black",
    ":hover": {
      cursor: "pointer",
      backgroundColor: "secondary.main",
      color: "common.white"
    }
  } as SxProps<Theme>,
}