import { FC, useCallback, useEffect, useState } from "react";
import { Box, SelectChangeEvent, Theme } from "@mui/material";
import { SxProps } from "@mui/system";

import { InputLabel } from "../../../../../../components/inputLabel";
import { TextSelect } from "../../../../../../components/textSelect";
import { VisibleForm } from "../../../../../../components/visibleForm";

import { IWorkReviewerForm, Reviewers } from "../../../../../../store/types";
import { palette } from "../../../../../../theme/colors";


interface IProps {
  workResponseForm: IWorkReviewerForm[]
}

export const WorkForms: FC<IProps> = ({ workResponseForm }) => {

  const [activeReviewForm, setActiveReviewForm] = useState<IWorkReviewerForm>()

  useEffect(() => {
    if (workResponseForm.length > 0 && !activeReviewForm)
      changeActiveReviewForm(workResponseForm[0])
  }, [workResponseForm])

  const changeActiveReviewForm = useCallback((reviewForm: IWorkReviewerForm) => {
    setActiveReviewForm(JSON.parse(JSON.stringify(reviewForm)))
  }, [workResponseForm])

  const reviewsList = workResponseForm.map((workresponse, index) => {
    if (workresponse.reviewer === Reviewers.TEACHER)
      return {
        id: workresponse.name,
        name: `Преподаватель (${workresponse.name})`
      }
    if (workresponse.reviewer === Reviewers.EXPERT)
      return {
        id: workresponse.name,
        name: `Эксперт (${workresponse.name})`
      }
    return {
      id: workresponse.name,
      name: `Пир (${workresponse.name})`
    }
  })

  const handleOnChangeReviewer = useCallback((reviewerWork: SelectChangeEvent<unknown>) => {
    if (reviewerWork) {
      const findRiviewForm = workResponseForm.find(work => work.name === reviewerWork.target.value)
      if (findRiviewForm)
        changeActiveReviewForm(findRiviewForm)
    }
  }, [workResponseForm])

  return (
    <Box>
      {activeReviewForm && reviewsList && reviewsList.length > 0 && (
        <>
          <InputLabel
            title={"Выбор рецензента:"}
          />

          <TextSelect
            items={reviewsList}
            value={activeReviewForm.name}
            onChange={handleOnChangeReviewer}
          />

          <Box sx={{ margin: "20px 0px 0px 0px" }}>
            <VisibleForm
              answerBoxColor={palette.fill.success}
              form={{ responses: activeReviewForm.responses }}
            />
          </Box>
        </>
      )}

    </Box>
  )
}

const styles = {
  subTitle: {
    '@media (max-width: 900px)': {
      display: "none",
      opacity: 0,
      width: "0px",
      height: "0px"
    }
  } as SxProps<Theme>,
}