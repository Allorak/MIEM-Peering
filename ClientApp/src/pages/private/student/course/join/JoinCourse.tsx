import { FC, SetStateAction, useState } from "react";
import { useNavigate, generatePath } from "react-router-dom";

import { Popup } from "../../../../../components/popup";
import { JoinCourseForm } from "./JoinCourseForm";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { actions } from '../../../../../store/addCourse';
import { paths } from "../../../../../app/constants/paths";


interface IProps {
    popupOpen: boolean,
    onCloseHandler(value: SetStateAction<boolean>): void
}

export const JoinCourse: FC<IProps> = ({ popupOpen, onCloseHandler }) => {
    
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.newCourse.isLoading)
    const errorState = useAppSelector(state => state.newCourse.error)
    const payload = useAppSelector(state => state.newCourse.payload)
    const history = useNavigate()

    if (payload && payload.courseId) {
        history(generatePath(paths.student.courses.course, {courseId: payload.courseId}))
        dispatch(actions.courseSetInitialState())
        
    }

    return (
        <Popup
            title={'Присоединиться к курсу'}
            open={popupOpen}
            loading={loading}
            onCloseHandler={onCloseHandler}
        >
            <JoinCourseForm />
        </Popup>
    )
}