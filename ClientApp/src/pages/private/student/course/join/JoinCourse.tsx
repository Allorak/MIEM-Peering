import { FC, SetStateAction, useCallback } from "react";

import { Popup } from "../../../../../components/popup";
import { JoinCourseForm } from "./JoinCourseForm";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { joinCourse } from "../../../../../store/JoinCourse/thunks/joinCourse";
import { actions } from "../../../../../store/JoinCourse";
import { fetchCourses } from "../../../../../store/courses/thunks/courses";

interface IProps {
    popupOpen: boolean,
    onCloseHandler(value: SetStateAction<boolean>): void
}

export const JoinCourse: FC<IProps> = ({ popupOpen, onCloseHandler }) => {

    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.joinCourse.isLoading)
    const payload = useAppSelector(state => state.joinCourse.joinStatus)

    const handleRequest = useCallback((courseCode: string) => {
        dispatch(joinCourse(courseCode))
    }, [dispatch])

    if (payload) {
        onCloseHandler(false)
        dispatch(actions.courseSetInitialState())
        dispatch(fetchCourses())
    }

    return (
        <Popup
            title={'Присоединиться к курсу'}
            open={popupOpen}
            loading={loading}
            onCloseHandler={onCloseHandler}
        >
            <JoinCourseForm
                onSubmit={handleRequest}
            />
        </Popup>
    )
}