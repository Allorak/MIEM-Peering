import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { IDeadlines } from "../../store/types"
import { palette } from "../../theme/colors";


export const Deadlines: FC<IDeadlines> = ({
  sBegin,
  sEnd,
  rBegin,
  rEnd,
}) => {

  console.log(sEnd!.toLocaleTimeString(), "SSS")
  return (
    <Box sx={styles.wrapper}>
      {sBegin && (
        <Box sx={{ ...styles.dateBox, ...styles.startBox }}>
          <Typography variant={'h6'}>
            {"Период сдачи работ начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Дата и время, когда открывается период сдачи"}
          </Typography>

          <Box sx={styles.fieldsContainer}>
            <Typography variant={"h6"}>
              {sBegin.toLocaleDateString()}
            </Typography>

            <Typography variant={"h6"}>
              {sBegin.toLocaleTimeString().split(":", 2).join(":")}
            </Typography>
          </Box>
        </Box>
      )}

      {sEnd && (
        <Box sx={{ ...styles.dateBox, ...styles.endBox }}>
          <Typography variant={'h6'}>
            {"Период сдачи работ заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Дата и время окончания периода сдачи работ"}
          </Typography>

          <Box sx={styles.fieldsContainer}>
            <Typography variant={"h6"}>
              {sEnd.toLocaleDateString()}
            </Typography>

            <Typography variant={"h6"}>
              {sEnd.toLocaleTimeString().split(":", 2).join(":")}
            </Typography>

          </Box>
        </Box>
      )}

      {rBegin && (
        <Box sx={{ ...styles.dateBox, ...styles.startBox }}>
          <Typography variant={'h6'}>
            {"Период проверки начинается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Дата и время начала периода проверки"}
          </Typography>

          <Box sx={styles.fieldsContainer}>

            <Typography variant={"h6"}>
              {rBegin.toLocaleDateString()}
            </Typography>

            <Typography variant={"h6"}>
              {rBegin.toLocaleTimeString().split(":", 2).join(":")}
            </Typography>
          </Box>
        </Box>
      )}

      {rEnd && (
        <Box sx={{ ...styles.dateBox, ...styles.endBox }}>
          <Typography variant={'h6'}>
            {"Период проверки заканчивается"}
          </Typography>

          <Typography variant={'body1'}>
            {"Дата и время закрытия периода проверки"}
          </Typography>

          <Box sx={styles.fieldsContainer}>
            <Typography variant={"h6"}>
              {rEnd.toLocaleDateString()}
            </Typography>
            <Typography variant={"h6"}>
              {rEnd.toLocaleTimeString().split(":", 2).join(":")}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}

const styles = {
  wrapper: {
    display: "grid",
    gridGap: "10px",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr) )",
    margin: "0px 0px 10px 0px"
  } as SxProps<Theme>,
  dateBox: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)'
  } as SxProps<Theme>,
  fieldsContainer: {
    display: 'flex',
    justifyContent: "space-between",
    gap: '5px',
    margin: "10px 0px 0px 0px"
  } as SxProps<Theme>,
  startBox: {
    borderTop: `7px solid ${palette.fill.secondary}`
  } as SxProps<Theme>,
  endBox: {
    borderTop: `7px solid ${palette.fill.primary}`
  } as SxProps<Theme>,
}