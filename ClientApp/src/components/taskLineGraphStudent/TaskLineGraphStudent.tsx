import { FC } from "react";
import { 
  HorizontalGridLines, 
  LineMarkSeries, 
  LineMarkSeriesPoint, 
  LineSeries, LineSeriesPoint, 
  VerticalGridLines, 
  XAxis, 
  XYPlot, 
  YAxis 
} from "react-vis";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { palette } from "../../theme/colors";

import { IStudentSubmissionGrades, Reviewers } from "../../store/types";

import * as globalStyles from "../../const/styles";

interface IProps {
  graphProps: IStudentSubmissionGrades
}

export const TaskLineGraphStudent: FC<IProps> = ({ graphProps }) => {
  const teacherGraph = graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.TEACHER)
  const expertGraph = graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.EXPERT)
  const peersGraph = graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.PEER)

  const teacherData: LineSeriesPoint[] | undefined = teacherGraph.length > 0 && peersGraph.length > 0 ?
    peersGraph.map((peersCoordinate, index) => ({
      y: teacherGraph[0].value,
      x: index
    })) : undefined

  const expertData: LineSeriesPoint[] | undefined = expertGraph.length > 0 && peersGraph.length > 0 ?
    peersGraph.map((peersCoordinate, index) => ({
      y: expertGraph[0].value,
      x: index
    })) : undefined

  const peersData: LineMarkSeriesPoint[] | undefined = peersGraph.length > 0 ?
    peersGraph.map((peersCoordinate, index) => ({
      y: peersCoordinate.value,
      x: index
    })) : undefined

  const teacherColor = palette.hover.danger
  const expertColor = palette.hover.success
  const peersColor = palette.hover.info

  return (
    <Box sx={styles.graphBox}
      onTouchMove={(e) => e.preventDefault()}
    >
      <Box>
        <Typography
          variant={"h6"}
          margin={"0px 0px 10px 0px"}
          textAlign={"center"}
        >
          {"Результаты проверки"}
        </Typography>

        <Box
          sx={styles.graphContainer}
        >
          <XYPlot
            height={300}
            width={980}
            xType="linear"
            onTouchMove={(e) => e.preventDefault()}
            yDomain={[graphProps.minGrade, graphProps.maxGrade]}
          >
            <HorizontalGridLines />
            <VerticalGridLines />
            <YAxis title="Оценки" />
            <XAxis />

            {teacherData && (
              <LineSeries
                style={{
                  strokeWidth: '2px'
                }}
                color={teacherColor}
                data={teacherData}
                animation={{ damping: 20, stiffness: 80 }}
              />
            )}

            {expertData && (
              <LineSeries
                style={{
                  strokeWidth: '2px',
                  opacity: 0.8
                }}
                color={expertColor}
                data={expertData}
                animation={{ damping: 10, stiffness: 40 }}
              />
            )}

            {peersData && (
              <LineMarkSeries
                style={{
                  strokeWidth: '2px'
                }}
                lineStyle={{ stroke: peersColor, opacity: 0.8 }}
                markStyle={{ fill: peersColor, strokeWidth: "0px" }}
                data={peersData}
                animation={{ damping: 10, stiffness: 20 }}
              />
            )}
          </XYPlot>
        </Box>
      </Box>

      <Box sx={styles.graphDescriptionsWrapper}>
        {teacherGraph.length > 0 && (
          <Box sx={styles.graphDescriptionContainer}>
            <Box sx={{ ...styles.graphMark, backgroundColor: teacherColor }} />
            <Typography variant={"body1"}>
              {'-- Преподаватель: '}

              <Typography
                variant={"h6"}
                color={'inherit'}
                component={'span'}
              >
                {teacherGraph[0].name}
              </Typography>
            </Typography>
          </Box>
        )}

        {expertGraph.length > 0 && (
          <Box sx={styles.graphDescriptionContainer}>
            <Box sx={{ ...styles.graphMark, backgroundColor: expertColor }} />
            <Typography variant={"body1"}>
              {'-- Экспертная проверка: '}

              <Typography
                variant={"h6"}
                color={'inherit'}
                component={'span'}
              >
                {expertGraph[0].name}
              </Typography>
            </Typography>
          </Box>
        )}

        {peersGraph.length > 0 && (
          <Box sx={styles.graphDescriptionContainer}>
            <Box sx={{ ...styles.graphMark, backgroundColor: peersColor }} />
            <Typography variant={"body1"}>
              {'-- Пиринговая проверка: '}
              {peersGraph.map((peer, index) => (
                <Typography
                  variant={"h6"}
                  color={'inherit'}
                  component={'span'}
                  key={index}
                >
                  {`${index + 1}-${peer.name}; `}
                </Typography>
              ))}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const styles = {
  graphBox: {
    display: "flex",
    flexDirection: "column",
    flexBasis: "calc(75% - 23px)",
    flexGrow: 0,
    flexShrink: 0,
    padding: "10px",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    backgroundColor: 'common.white',
    borderRadius: '4px',
    overflowX: "auto",
    overflowY: "hidden",
    '@media (max-width: 1321px)': {
      boxSizing: "border-box",
      flexBasis: "100%",
      flexGrow: 0,
      flexShrink: 0,
    }
  } as SxProps<Theme>,
  graphContainer: {
    margin: "0px auto",
    overflow: "auto",
    ...globalStyles.scrollStyles
  } as SxProps<Theme>,
  graphDescriptionsWrapper: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  } as SxProps<Theme>,
  graphDescriptionContainer: {
    display: "inline-flex",
    gap: "5px",
    alignItems: "center"
  } as SxProps<Theme>,
  graphMark: {
    width: "10px",
    height: "10px"
  } as SxProps<Theme>,
}