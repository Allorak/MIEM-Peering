import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { useCallback } from "react";
import { FC, useState } from "react";
import { Hint, HorizontalGridLines, LineMarkSeries, LineMarkSeriesPoint, LineSeries, LineSeriesPoint, VerticalGridLines, XAxis, XYPlot, YAxis } from "react-vis";
import { IWorkGraph, Reviewers, WorkGraphTypes } from "../../../../../../store/types";
import { palette } from "../../../../../../theme/colors";
import * as globalStyles from "../../../../../../const/styles"

interface IProps {
  graphProps: IWorkGraph
}

export const WorkLineGraph: FC<IProps> = ({ graphProps }) => {

  const title = graphProps.graphType === WorkGraphTypes.CRITERIA ?
    graphProps.title : graphProps.graphType === WorkGraphTypes.FINAL ?
      "Итоговые результаты" : ""

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

  const [hoveredMark, setHoveredMark] = useState<LineMarkSeriesPoint>()

  const hanldeOnMouseMarkHover = useCallback((markProps: LineMarkSeriesPoint) => {
    console.log(markProps)
    setHoveredMark(markProps)
  }, [graphProps])

  const hanldeOnMouseMarkHoverOut = useCallback((markProps: LineMarkSeriesPoint) => {
    setHoveredMark(undefined)
  }, [graphProps])

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
          {title}
        </Typography>


        <Box
          sx={styles.graphContainer}
        >
          <XYPlot
            height={300}
            width={860}
            xType="linear"
            // onTouchMove={(e) => e.preventDefault()}
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
                onValueMouseOver={hanldeOnMouseMarkHover}
                onValueMouseOut={hanldeOnMouseMarkHoverOut}
              />
            )}
            {/* {hoveredMark && (
                <Hint
                  xType="literal"
                  yType="literal"
                  getX={(d: LineMarkSeriesPoint) => d.x}
                  getY={(d: LineMarkSeriesPoint) => d.y}
                  value={[5, 10]}
                >
                  <div>
                    {hoveredMark}
                  </div>
                </Hint>
              )} */}
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
    gap: "15px",
    boxShadow: '0px 2px 6px 0px rgba(34, 60, 80, 0.2)',
    backgroundColor: 'common.white',
    borderRadius: '4px',
    padding: "15px"
  } as SxProps<Theme>,
  graphContainer: {
    margin: "0px auto",
    maxWidth: "860px",
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