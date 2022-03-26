import { FC } from "react"
import { Box, Typography, Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import { Line, LineConfig } from '@ant-design/plots'
import { Datum } from "@ant-design/charts"

import { palette } from "../../../../../../theme/colors"
import { IFinalGradeItemOverview } from "../../../../../../store/types"


interface IProps {
  grades: IFinalGradeItemOverview[]
}
export const FinalGradesGraph: FC<IProps> = ({ grades }) => {
  const config: LineConfig = {
    data: grades,
    animation: {
      appear: {
        duration: 3000
      }
    },
    color: palette.active.success,
    xField: "student",
    yField: "value",
    xAxis: {
      tickCount: 5,
      range: [0, 1]
    },
    yAxis: {
      min: 0,
      max: 10,
    },
    point: {
      shape: 'circle',
      color: palette.fill.success,
      size: 6
    },
    lineStyle: {
      stroke: palette.fill.success,
      lineWidth: 3
    },
    tooltip: {
      formatter: (datum: Datum) => {
        return { name: "Итоговая оценка", value: `${datum.value}` };
      },
    },
    area: {
      style: {
        fill: "l(270) 0:#ffffff 0.5:#13c790 1:#01BC62"
      }
    }
  }

  return (
    <Box sx={styles.wrapper}>
      <Typography
        variant={"h6"}
        margin={"0px 0px 10px 0px"}
        textAlign={"center"}
      >
        {"График успеваемости"}
      </Typography>

      <Box sx={styles.graphContainer}>
        <Line {...config} />
      </Box>
    </Box>
  )
}

const styles = {
  wrapper: {
    backgroundColor: 'common.white',
    boxSizing: 'border-box',
    maxHeight: '100%',
    borderRadius: '4px',
    padding: "15px",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)'
  } as SxProps<Theme>,
  graphContainer: {
    m: "20px",
    "@media (max-width: 1200px)": {
      m: "15px",
    },
    "@media (max-width: 900px)": {
      m: "10px",
    }
  } as SxProps<Theme>,
}