import { FC, useMemo } from "react"
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalGridLines,
  LineMarkSeries
} from 'react-vis'
import { Box, Typography, Theme } from "@mui/material";
import { SxProps } from "@mui/system"

import { palette } from "../../../../../../theme/colors";


interface IProps {
  grades: number[]
}
export const FinalGradesGraph: FC<IProps> = ({ grades }) => {

  const graphData = useMemo(() => (
    grades.map((grade, index) => ({ x: index, y: grade }))
  ), [grades])

  return (
    <Box
      sx={styles.wrapper}
      onTouchMove={(e) => e.preventDefault()}
    >

      <Typography
        variant={"h6"}
        margin={"0px 0px 10px 0px"}
        textAlign={"center"}
      >
        {"График успеваемости"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            overflowY: "auto"
          }}
        >
          <XYPlot
            height={300}
            width={970}
            xType="linear"
            onTouchMove={(e) => e.preventDefault()}
            yDomain={[0, 10]}
          >
            <HorizontalGridLines />
            <VerticalGridLines />
            <YAxis title="- оценки"/>
            <XAxis title="- № работы" tickFormat={val => Math.round(val) === val ? val : ""} />
            <LineMarkSeries
              style={{
                strokeWidth: '2px'
              }}
              lineStyle={{ stroke: palette.fill.success }}
              markStyle={{ fill: palette.fill.success, strokeWidth: "0px" }}
              data={graphData}
            />
          </XYPlot>
        </Box>
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    boxSizing: 'border-box',
    height: '100%',
    borderRadius: '4px',
    padding: "15px",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)'
  } as SxProps<Theme>,
}