import { FC, useCallback, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { usePrivatePathStDashboard } from "../../../../../app/hooks/usePrivatePathStDashboard";

import { fetchAuthorformStudent, postAuthorformStudent } from "../../../../../store/authorformStudent";
import { IAuthorForm, IAuthorFormResponses, IQuestionTypes } from "../../../../../store/types";
import { DashboardWorkBox } from "../../../../../components/dashboardWorkBox";
import { FormAuthor } from "./FormAuthor";

export const Authorform: FC = () => {

  const dispatch = useAppDispatch()
  const { path } = usePrivatePathStDashboard()

  const status = useAppSelector(state => state.authorForm.isLoading)
  const error = useAppSelector(state => state.authorForm.error)
  const lock = useAppSelector(state => state.authorForm.isLock)
  const authorForm = useAppSelector(state => state.authorForm.authorFormPayload)
  const [responses, setResponses] = useState<IAuthorForm>()

  const onRequest = useCallback((formResponses: IAuthorFormResponses) => {
    if (path && path.taskId && formResponses.responses)
      dispatch(postAuthorformStudent(path.taskId, formResponses))
  }, [path])  

  const handleOnFormEdit = useCallback((value: string | number | undefined, questionId: string) => {
    setResponses(prev => {
      if (prev && prev.rubrics && prev.rubrics.length > 0) {
        return {
          rubrics: JSON.parse(JSON.stringify(prev.rubrics.map((item) => {
            if (item.id !== questionId) return  item
            if (item.type === IQuestionTypes.SELECT_RATE && (typeof value === 'number' || typeof value === 'undefined'))
              return { ...item, response: value }
            if (item.type !== IQuestionTypes.SELECT_RATE && (typeof value === 'string' || typeof value === 'undefined'))
              return { ...item, response: value }
          })))
        }
      }
    })
  }, [responses])

  useEffect(() => {
    if (authorForm && authorForm.rubrics && authorForm.rubrics.length > 0) {
        setResponses(JSON.parse(JSON.stringify(authorForm)))
      }
    }, [authorForm])

  useEffect(() => {
    if (path && path.taskId) {
      dispatch(fetchAuthorformStudent(path.taskId))
    }
  }, [])

  return (
    <DashboardWorkBox
      isLoading={status}
      isLock={lock}
      error={error}
    >
      {responses && responses.rubrics && responses.rubrics.length > 0 && (
      <>
        <FormAuthor 
          authorForm={responses}
          onSubmit={onRequest}
          onEdit={handleOnFormEdit}        
        />
      </>
      )}
    </DashboardWorkBox>
  )
}