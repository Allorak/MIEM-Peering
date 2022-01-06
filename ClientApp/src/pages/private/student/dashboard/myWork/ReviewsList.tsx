import { FC, useCallback } from "react"
import { Box } from "@mui/system"
import { SelectChangeEvent } from "@mui/material"

import { TextSelect } from "../../../../../components/textSelect"
import { IWorkItem } from "../../../../../store/types"

interface IProps {
  selectedReviewId: string
  reviewsList: IWorkItem[]
  onReviewerChange: (id: string) => void
}

export const ReviewsList: FC<IProps> = ({
  selectedReviewId,
  reviewsList,
  onReviewerChange
}) => {

  const handleReviewerChange = useCallback((e: SelectChangeEvent<unknown>) => {
    onReviewerChange(String(e.target.value))
  }, [])

  return (
    <Box>
      <TextSelect
        value={selectedReviewId}
        items={reviewsList.map(student => ({ id: student.submissionId, name: student.studentName }))}
        onChange={handleReviewerChange}
      />
    </Box>
  )
}