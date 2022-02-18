import { FC, SetStateAction, useCallback, useEffect } from "react";
import { useNavigate, generatePath } from "react-router-dom";

import { Popup } from "../../../../../components/popup";
import { AddCourseForm } from "./AddCourseForm";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { actions, addCourse, deleteCourse, updateCourse } from '../../../../../store/addCourse';
import { paths } from "../../../../../app/constants/paths";
import { ICourses } from "../../../../../store/types";
import { fetchCourses } from "../../../../../store/courses/thunks/courses";


interface IProps {
    popupOpen: boolean,
    onCloseHandler(value: SetStateAction<boolean>): void
    editCourse?: ICourses
}

export const AddCourse: FC<IProps> = ({ popupOpen, onCloseHandler, editCourse }) => {

    const dispatch = useAppDispatch()
    const history = useNavigate()

    const loading = useAppSelector(state => state.newCourse.isLoading)
    const payload = useAppSelector(state => state.newCourse.payload)
    const udateStatus = useAppSelector(state => state.newCourse.udateStatus)

    useEffect(() => {
        if (payload && payload.id) {
            history(generatePath(paths.teacher.courses.course, { courseId: payload.id }))
            dispatch(actions.reset())
        }
    }, [payload])

    useEffect(() => {
        if (udateStatus) {
            dispatch(actions.reset())
            dispatch(fetchCourses())
            onCloseHandler(false)
        }
    }, [udateStatus])

    const handleRequest = useCallback((course: ICourses) => {
        if (editCourse && course.settings) {
            dispatch(updateCourse({
                id: editCourse.id,
                name: course.name.trim(),
                subject: course.subject.trim(),
                description: course.description && course.description.trim() !== "" ? course.description.trim() : undefined,
                settings: {
                    enableCode: course.settings.enableCode
                }
            }))
        } else {
            dispatch(addCourse({
                name: course.name.trim(),
                subject: course.subject.trim(),
                description: course.description !== undefined && course.description.trim() !== "" ? course.description.trim() : undefined
            }))
        }
    }, [editCourse])

    const handleOnDelete = useCallback(() => {
        if (editCourse) {
            dispatch(deleteCourse(editCourse.id))
        }
    }, [editCourse])

    return (
        <Popup
            title={editCourse ? 'Изменить' : 'Создать курс'}
            open={popupOpen}
            loading={loading}
            onCloseHandler={onCloseHandler}
        >
            <AddCourseForm
                editCourse={editCourse}
                onRequest={handleRequest}
                onDelete={handleOnDelete}
            />
        </Popup>
    )
}