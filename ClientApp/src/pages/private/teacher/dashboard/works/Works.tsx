import { FC, useCallback, useState } from "react";
import { Box, SxProps, Theme } from "@mui/system";

import { IWorkItem } from "../../../../../store/types";
import { WorksList } from "./WorksList";


export const Works: FC = () => {

  const [activeWork, setActiveWork] = useState<IWorkItem>(JSON.parse(JSON.stringify(fakeData[0])))

  const handleOnWorkChange = useCallback((workId: string) => {
    if (activeWork && activeWork.id !== workId) {
      const workItem = fakeData.find(work => work.id === workId)
      if (workItem) {
        setActiveWork(
          JSON.parse(JSON.stringify(workItem))
        )
      }
    }
  }, [activeWork, setActiveWork])

  return (
    <Box sx={styles.gridContainer}>
      {/* левая панель */}
      <Box sx={styles.leftContainer}>
        <Box
          sx={{height: "250px", backgroundColor: "pink", borderRadius: "4px", width: "100%"}}
        >
          {JSON.stringify(activeWork)}
        </Box>
      </Box>

      {/* правая панель */}
      <Box sx={styles.rightContainer}>
        <WorksList
          worksCatalog={fakeData}
          activeWorkId={activeWork.id}
          onWorkChange={handleOnWorkChange}
        />
      </Box>
    </Box>
  )
}

const styles = {
  gridContainer: {
    display: "flex",
    gap: "25px",
    width: "100%",
    alignItems: "flex-start"
  } as SxProps<Theme>,
  leftContainer: {
    flex: "1 1 100%"
  } as SxProps<Theme>,
  rightContainer: {
    flex: "0 0 230px"
  } as SxProps<Theme>,
}

const fakeResponses = [
  {
    id: "q1",
    order: 0,
    title: "Rate the work",
  },
  {
    id: "q2",
    order: 1,
    title: "What is good about this work? 👍"
  },
  {
    id: "q3",
    order: 2,
    title: "What's wrong with this work? 👎"
  }
]

const fakeData: IWorkItem[] = [
  {
    id: "w-1",
    author: {
      name: "Иванов Иван Иванов Иван",
      id: "a-1"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-2",
    author: {
      name: "Вася Пупкин",
      id: "a-2"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-3",
    author: {
      name: "Иванов Иван",
      id: "a-1"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-4",
    author: {
      name: "Вася Пупкин",
      id: "a-2"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-5",
    author: {
      name: "Иванов Иван",
      id: "a-1"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-6",
    author: {
      name: "Вася Пупкин",
      id: "a-2"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-7",
    author: {
      name: "Иванов Иван",
      id: "a-1"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  },
  {
    id: "w-8",
    author: {
      name: "Вася Пупкин",
      id: "a-2"
    },
    responses: JSON.parse(JSON.stringify(fakeResponses.map((item, index) => ({ ...item, response: `Иванов Иван: Ответ ${index + 1}` }))))
  }
]
