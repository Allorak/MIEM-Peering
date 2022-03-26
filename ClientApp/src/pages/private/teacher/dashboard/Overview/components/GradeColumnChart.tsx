import { FC, useMemo } from "react"
import { Box, Typography, Theme } from "@mui/material"
import { SxProps } from "@mui/system"
import { Column, ColumnConfig } from '@ant-design/plots'
import { Datum } from "@ant-design/charts"

import { palette } from "../../../../../../theme/colors"
import { IFinalGradeItemOverview } from "../../../../../../store/types"


interface IProps {
  grades: IFinalGradeItemOverview[]
}

interface IColumnGradeItem {
  grade: '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10',
  value: number
}
export const GradeColumnChart: FC<IProps> = ({ grades }) => {
  const data = useMemo((): IColumnGradeItem[] => {
    if (grades && grades.length > 0) {
      const cloneDefaultData: IColumnGradeItem[] = JSON.parse(JSON.stringify(defaultData))

      grades.forEach(item => {
        const roundGrade = Math.round(item.value)
        const index = cloneDefaultData.findIndex(item => item.grade === roundGrade.toString())

        if (index > -1) {
          const columnValue = cloneDefaultData[index].value
          cloneDefaultData[index].value = columnValue + 1
        }
      })

      return cloneDefaultData
    }
    return []
  }, [grades])


  const config = useMemo((): ColumnConfig => ({
    data,
    xField: 'grade',
    yField: 'value',
    seriesField: '',
    animation: {
      appear: {
        duration: 3000
      }
    },
    color: (datum: Datum) => {
      switch (datum.grade) {
        case '1':
          return palette.fillLight.danger
        case '2':
          return palette.fillLight.danger
        case '3':
          return palette.fillLight.danger
        case '4':
          return palette.fillLight.warning
        case '5':
          return palette.fillLight.warning
        case '6':
          return palette.fillLight.success
        case '7':
          return palette.fillLight.success
        case '8':
          return palette.fillLight.info
        case '9':
          return palette.fillLight.info
        case '10':
          return palette.fillLight.info
        default:
          return palette.fillLight.danger
      }
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
        formatter: (datum) => `Оценка "${datum}"`
      },
    },
    yAxis: {
      min: 0,
    },
    tooltip: {
      formatter: (datum) => {
        if ('value' in datum && typeof datum.value === 'number') {
          const studentQuantities = grades.length
          if (studentQuantities > 0) {
            const percent = (datum.value / studentQuantities) * 100
            if (percent > 0)
              return { name: "Кол. студентов", value: `${datum.value} (${percent.toFixed(1)}%)` }
          }
        }
        return { name: "Кол. студентов", value: `${datum.value}` };
      },
      title: (title: string, datum: Datum) => {
        switch (datum.grade) {
          case '0':
          case '1':
          case '2':
          case '3':
            return "Неудовлетворительно"
          case '4':
          case '5':
            return "Удовлетворительно"
          case '6':
          case '7':
            return "Хорошо"
          default:
            return "Отлично"
        }
      }
    }
  }), [grades, data])

  return (
    <Box sx={styles.wrapper}>
      <Typography
        variant={"h6"}
        margin={"0px 0px 10px 0px"}
        textAlign={"center"}
      >
        {"Диаграмма успеваемости"}
      </Typography>

      <Box sx={styles.graphContainer}>
        <Column {...config} />
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

const defaultData: IColumnGradeItem[] = [
  {
    grade: '0',
    value: 0,
  },
  {
    grade: '1',
    value: 0,
  },
  {
    grade: '2',
    value: 0,
  },
  {
    grade: '3',
    value: 0,
  },
  {
    grade: '4',
    value: 0,
  },
  {
    grade: '5',
    value: 0,
  },
  {
    grade: '6',
    value: 0,
  },
  {
    grade: '7',
    value: 0,
  },
  {
    grade: '8',
    value: 0,
  },
  {
    grade: '9',
    value: 0,
  },
  {
    grade: '10',
    value: 0,
  },
];