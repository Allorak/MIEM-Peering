import { FC } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import { IDeadlines } from "../../store/types"
import { palette } from "../../theme/colors";


export const Deadlines: FC<IDeadlines> = ({
  submissionStartDateTime: sBegin,
  submissionEndDateTime: sEnd,
  reviewStartDateTime: rBegin,
  reviewEndDateTime: rEnd,
}) => {

  return (
    <Grid container spacing={"10px"}>
      <Grid item xs={12} md={6} lg={3}>
        {sBegin && typeof sBegin !== 'string' && (
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
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        {sEnd && typeof sEnd !== 'string' && (
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
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        {rBegin && typeof rBegin !== 'string' && (
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
      </Grid>

      <Grid item xs={12} md={6} lg={3}>
        {rEnd && typeof rEnd !== 'string' && (
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
      </Grid>
    </Grid>
  )
}

const styles = {
  dateBox: {
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    height: "100%",
    boxSizing: "border-box"
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
  } as SxProps<Theme>
}