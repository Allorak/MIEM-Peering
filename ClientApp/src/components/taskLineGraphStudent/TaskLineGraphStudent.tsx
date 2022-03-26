import { FC, useMemo } from "react";
import { Line, LineConfig } from '@ant-design/plots'
import { Datum } from "@ant-design/charts";
import { Box, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";

import { palette } from "../../theme/colors";

import { IFinalGradeItemOverview, IStudentSubmissionGrades, IWorkReviewСoordinates, Reviewers } from "../../store/types";

interface IProps {
  graphProps: IStudentSubmissionGrades
}

export const TaskLineGraphStudent: FC<IProps> = ({ graphProps }) => {
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
            stroke: palette.fill.success,
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
        duration: 3000
      }
    },
    color: palette.active.info,
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
      color: palette.fill.info,
      size: 6
    },
    lineStyle: {
      stroke: palette.fill.info,
      lineWidth: 3
    },
    tooltip: {
      formatter: (datum: Datum) => {
        return { name: "Итоговая оценка", value: `${datum.value}` };
      },
    },
    area: {
      style: {
        fill: `l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff`
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
          {"Результаты проверки"}
        </Typography>

        <Box
          sx={styles.graphContainer}
        >
          <Line {...config} />
        </Box>
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
  } as SxProps<Theme>
}