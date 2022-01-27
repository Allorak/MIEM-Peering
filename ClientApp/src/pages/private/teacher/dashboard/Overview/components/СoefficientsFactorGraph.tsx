import { FC, useMemo } from "react";
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  LineMarkSeries,
  DiscreteColorLegend
} from 'react-vis';
import { Typography, Box, Theme } from "@mui/material"
import { SxProps } from "@mui/system";

import { palette } from "../../../../../../theme/colors"

import * as globalStyles from "../../../../../../const/styles"


interface IProps {
  confidenceFactors?: number[]
  currentConfidenceFactors?: number[]
}

export const СoefficientsFactorGraph: FC<IProps> = ({ confidenceFactors, currentConfidenceFactors }) => {

  const graphData = useMemo(() => ({
    current: currentConfidenceFactors?.map((grade, index) => ({ x: index, y: grade })),
    new: confidenceFactors?.map((grade, index) => ({ x: index, y: grade }))
  }), [confidenceFactors, currentConfidenceFactors])

  const legendItems = useMemo(() => {
    const legends = []

    if (graphData.current) {
      legends.push({
        title: 'Текущий коэффициент',
        color: palette.fill.primary,
        strokeWidth: 3
      })
    }

    if (graphData.new) {
      legends.push({
        title: 'Вычисленный коэффициент',
        color: palette.fill.secondary,
        strokeWidth: 3
      })
    }

    return legends
  }, [graphData])

  return (
    <Box
      onTouchMove={(e) => e.preventDefault()}
      sx={styles.wrapper}
    >
      <Typography
        variant={"h6"}
        margin={"0px 0px 10px 0px"}
        textAlign={"center"}
      >
        {"График коэффициентов доверия"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Box
          sx={{
            height: "355px",
            overflowY: "auto",
            ...globalStyles.scrollStyles
          }}
        >
          <XYPlot
            height={300}
            width={970}
            xType="linear"
            onTouchMove={(e) => e.preventDefault()}
            yDomain={[0, 1]}
          >
            <VerticalGridLines />
            <YAxis title="- коэффициент" />
            <XAxis title="- № участника" tickFormat={val => Math.round(val) === val ? val : ""} />

            {graphData.new && (
              <LineMarkSeries
                style={{
                  strokeWidth: '2px'
                }}
                lineStyle={{ stroke: palette.fill.secondary }}
                markStyle={{ fill: palette.fill.secondary, strokeWidth: "0px" }}
                data={graphData.new}
              />
            )}

            {graphData.current && (
              <LineMarkSeries
                style={{
                  strokeWidth: '2px'
                }}
                className="linemark-series-example-2"
                lineStyle={{ stroke: palette.fill.primary }}
                markStyle={{ fill: palette.fill.primary, strokeWidth: "0px" }}
                data={graphData.current}
              />
            )}

            <DiscreteColorLegend items={legendItems} orientation="horizontal" />
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