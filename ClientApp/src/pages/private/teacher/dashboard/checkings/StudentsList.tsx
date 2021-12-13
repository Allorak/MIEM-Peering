import { FC, useCallback } from "react"
import { Box } from "@mui/system"
import { SelectChangeEvent } from "@mui/material"

import { TextSelect } from "../../../../../components/textSelect"
import { IStudentList } from "../../../../../store/types"

interface IProps {
  selectedStudentId: string
  studentsList: IStudentList
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
        items={studentsList.students.map(student => ({ id: student.id, name: student.fullName }))}
        onChange={handleStudentChange}
      />
    </Box>
  )
}