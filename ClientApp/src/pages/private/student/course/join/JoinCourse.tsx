import { FC, SetStateAction, useCallback} from "react";
import { generatePath, useNavigate} from "react-router-dom";

import { Popup } from "../../../../../components/popup";
import { JoinCourseForm } from "./JoinCourseForm";

import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { joinCourse } from "../../../../../store/JoinCourse/thunks/joinCourse";
import { paths } from "../../../../../app/constants/paths";
import { actions } from "../../../../../store/JoinCourse";

interface IProps {
    popupOpen: boolean,
    onCloseHandler(value: SetStateAction<boolean>): void
}

export const JoinCourse: FC<IProps> = ({ popupOpen, onCloseHandler }) => {
    
    const dispatch = useAppDispatch()
    const loading = useAppSelector(state => state.joinCourse.isLoading)
    const payload = useAppSelector(state => state.joinCourse.payload)
    const history = useNavigate()

    const handleRequest = useCallback((courseCode: string) => {
        dispatch(joinCourse(courseCode))
    }, [dispatch])

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
            <JoinCourseForm 
                onSubmit = {handleRequest}
            />
        </Popup>
    )
}