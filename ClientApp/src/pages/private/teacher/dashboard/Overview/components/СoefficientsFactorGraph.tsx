import { FC, useMemo } from "react"
import { Line, LineConfig } from '@ant-design/plots'
import { Typography, Box, Theme } from "@mui/material"
import { SxProps } from "@mui/system"

import { palette } from "../../../../../../theme/colors"

import { IConfidenceFactorItemOverview, IFinalGradeItemOverview } from "../../../../../../store/types";


interface IProps {
  confidenceFactors?: IFinalGradeItemOverview[]
  currentConfidenceFactors?: IFinalGradeItemOverview[]
}

export const СoefficientsFactorGraph: FC<IProps> = ({ confidenceFactors, currentConfidenceFactors }) => {
  const isFullConfidence = useMemo(() => (
    confidenceFactors && confidenceFactors.length > 0 && currentConfidenceFactors && currentConfidenceFactors.length > 0 ? 0 :
      confidenceFactors && confidenceFactors.length > 0 ? 1 : -1
  ), [currentConfidenceFactors, confidenceFactors])

  const data = useMemo((): IConfidenceFactorItemOverview[] | IFinalGradeItemOverview[] => {
    if (confidenceFactors && confidenceFactors.length > 0 && currentConfidenceFactors && currentConfidenceFactors.length > 0) {
      const currentData: IConfidenceFactorItemOverview[] = currentConfidenceFactors.map(item => ({
        category: legends.current,
        ...item
      }))

      const newData: IConfidenceFactorItemOverview[] = confidenceFactors.map(item => ({
        category: legends.new,
        ...item
      }))

      return JSON.parse(JSON.stringify(currentData.concat(newData)))
    }

    if (confidenceFactors && confidenceFactors.length > 0) {
      return JSON.parse(JSON.stringify(confidenceFactors))
    }

    if (currentConfidenceFactors && currentConfidenceFactors.length > 0) {
      return JSON.parse(JSON.stringify(currentConfidenceFactors))
    }

    return []
  }, [confidenceFactors, currentConfidenceFactors])

  const config = useMemo((): LineConfig => ({
    data,
    animation: {
      appear: {
        duration: 3000
      }
    },
    color: isFullConfidence === 0 ? [palette.fill.primary, palette.fill.secondary] : isFullConfidence === -1 ? palette.fill.primary : palette.fill.secondary,
    xField: 'student',
    yField: 'value',
    xAxis: {
      tickCount: 5,
      range: [0, 1]
    },
    yAxis: {
      min: 0,
      max: 1,
    },
    point: {
      shape: 'circle',
      size: 6
    },
    lineStyle: {
      lineWidth: 3
    },
    ...(isFullConfidence !== 0 && {
      tooltip: {
        formatter: (datum) => {
          if (isFullConfidence === -1)
            return { name: legends.current, value: `${datum.value}` }
          return { name: legends.new, value: `${datum.value}` }
        },
      },
    }),
    ...(isFullConfidence === 0 && {
      seriesField: 'category',
      legend: {
        position: "bottom",
        itemName: {
          style: {
            fill: '#000',
            fontSize: 14
          },
          formatter: (name) => name,
        },
      },
    })
  }), [isFullConfidence, data])

  return (
    <Box sx={styles.wrapper}>
      <Typography
        variant={"h6"}
        margin={"0px 0px 10px 0px"}
        textAlign={"center"}
      >
        {"График коэффициентов доверия"}
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

const legends = {
  current: "Текущий коэффициент",
  new: "Вычисленный коэффициент"
}