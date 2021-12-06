import { Box } from "@mui/system"
import { FC } from "react"
import { TextSelect } from "../../../../../components/textSelect"
import { ICatalog } from "../../../../../store/types"

interface IProps {
  selectedStudentId?: string
  studentsList: ICatalog[]
}

export const StudentsListCatalog: FC<IProps> = ({ selectedStudentId, studentsList }) => {


  return (
    <Box>
      <TextSelect
        value={selectedStudentId}
        items={studentsList}
        onChange={(e) => { console.log(e.target.value) }}
      />
    </Box>
  )
}