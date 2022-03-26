import { FC, useMemo } from "react";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import { Line, LineConfig } from '@ant-design/plots'
import { Datum } from "@ant-design/charts";

import { IFinalGradeItemOverview, IWorkGraph, IWorkReviewСoordinates, Reviewers, WorkGraphTypes } from "../../../../../../store/types";

import { palette } from "../../../../../../theme/colors";


interface IProps {
  graphProps: IWorkGraph
}

export const WorkLineGraph: FC<IProps> = ({ graphProps }) => {

  const title = useMemo(() => (
    graphProps.graphType === WorkGraphTypes.CRITERIA ?
      graphProps.title : graphProps.graphType === WorkGraphTypes.FINAL ?
        "Итоговые результаты" : ""
  ), [graphProps.graphType])

  const teacherData = useMemo((): IFinalGradeItemOverview | undefined => {
    const filterData: IWorkReviewСoordinates[] = JSON.parse(JSON.stringify(graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.TEACHER)))

    if (filterData.length > 0) {
      return {
        value: filterData[0].value,
        student: filterData[0].name
      }
    }
    return
  }, [graphProps])

  const expertData = useMemo((): IFinalGradeItemOverview | undefined => {
    const filterData: IWorkReviewСoordinates[] = JSON.parse(JSON.stringify(graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.EXPERT)))

    if (filterData.length > 0) {
      return {
        value: filterData[0].value,
        student: filterData[0].name
      }
    }
    return
  }, [graphProps])

  const peersData = useMemo((): IFinalGradeItemOverview[] => {
    const filterData: IWorkReviewСoordinates[] = JSON.parse(JSON.stringify(graphProps.coordinates.filter(coordinate => coordinate.reviewer === Reviewers.PEER)))
    return filterData.map(item => ({
      student: item.name,
      value: item.value
    }))
  }, [graphProps])

  const expertAnnotation = useMemo((): LineConfig['annotations'] => {
    if (expertData) {
      return [
        {
          type: 'text',
          position: ['min', expertData.value.toString()],
          content: `${expertData.student} (эксперт): ${expertData.value}`,
          offsetY: -4,
          style: {
            textBaseline: 'bottom',
            fontSize: 14,
          },
        },
        {
          type: 'line',
          start: ['min', expertData.value.toString()],
          end: ['max', expertData.value.toString()],
          style: {
            stroke: palette.fill.danger,
            lineWidth: 3
          },
        },
      ]
    }
    return []
  }, [expertData])

  const teacherAnnotation = useMemo((): LineConfig['annotations'] => {
    if (teacherData) {
      return [
        {
          type: 'text',
          position: ['min', teacherData.value.toString()],
          content: `${teacherData.student} (преподаватель): ${teacherData.value}`,
          offsetY: expertData && expertData.value === teacherData.value ? -24 : -4,
          style: {
            textBaseline: 'bottom',
            fontSize: 14,
            fontWeight: 700,
          },
        },
        {
          type: 'line',
          start: ['min', teacherData.value.toString()],
          end: ['max', teacherData.value.toString()],
          style: {
            stroke: palette.fill.danger,
            lineWidth: 3
          },
        },
      ]
    }
    return []
  }, [teacherData, expertData])

  const config = useMemo((): LineConfig => ({
    data: peersData.length > 0 ? peersData : teacherData ? [teacherData] : expertData ? [expertData] : [],
    animation: {
      appear: {
        duration: 1000
      }
    },
    color: graphProps.graphType === WorkGraphTypes.FINAL ? palette.active.success : palette.active.info,
    xField: "student",
    yField: "value",
    xAxis: {
      tickCount: 5,
      range: [0, 1],
      label: {
        style: {
          fontSize: 14
        }
      },
    },
    yAxis: {
      min: graphProps.minGrade,
      max: graphProps.maxGrade,
    },
    point: {
      shape: 'circle',
      color: graphProps.graphType === WorkGraphTypes.FINAL ? palette.fill.success : palette.fill.info,
      size: 6
    },
    lineStyle: {
      stroke: graphProps.graphType === WorkGraphTypes.FINAL ? palette.fill.success : palette.fill.info,
      lineWidth: 3
    },
    tooltip: {
      formatter: (datum: Datum) => {
        return { name: "Итоговая оценка", value: `${datum.value}` };
      },
    },
    area: {
      style: {
        fill: graphProps.graphType === WorkGraphTypes.FINAL ? 'l(270) 0:#ffffff 0.5:#13c790 1:#01BC62' : `l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff`
      }
    },
    ...((teacherAnnotation || expertAnnotation) && {
      ...(expertAnnotation && teacherAnnotation ? {
        annotations: [...teacherAnnotation, ...expertAnnotation]
      } : {
        annotations: expertAnnotation ?? teacherAnnotation
      })

    })
  }), [peersData, teacherAnnotation, expertAnnotation, peersData, expertData, graphProps])

  return (
    <Box sx={styles.wrapper}>
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
          <Line {...config} />
        </Box>
      </Box>
    </Box >
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