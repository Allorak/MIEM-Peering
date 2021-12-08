import { FC, useCallback, useEffect } from "react"
import { Box } from "@mui/system"
import { SelectChangeEvent } from "@mui/material"

import { TextSelect } from "../../../../../components/textSelect"
import { ICatalog } from "../../../../../store/types"

interface IProps {
  selectedStudentId: string
  studentsList: ICatalog[]
  onStudentChange: (id: string) => void
}

export const StudentsListSelect: FC<IProps> = ({
  selectedStudentId,
  studentsList,
  onStudentChange
}) => {

  const handleStudentChange = useCallback((e: SelectChangeEvent<unknown>) => {
    onStudentChange(String(e.target.value))
  }, [])

  return (
    <Box>
      <TextSelect
        value={selectedStudentId}
        items={studentsList}
        onChange={handleStudentChange}
      />
    </Box>
  )
}