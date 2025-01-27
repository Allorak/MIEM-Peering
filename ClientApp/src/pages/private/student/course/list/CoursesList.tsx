import { FC, useCallback, useEffect, useState } from "react"
import { generatePath } from "react-router"
import { useNavigate } from "react-router-dom"
import { Button, Typography } from "@mui/material"
import { Box, SxProps, Theme } from "@mui/system"

import { paths } from "../../../../../app/constants/paths"
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks"

import { CourseCard } from "../../../../../components/courseCard"
import List from "../../../../../components/list/List"
import { WorkBox } from "../../../../../components/workBox"
import { NoData } from "../../../../../components/noData"

import { fetchCourses } from "../../../../../store/courses/thunks/courses"
import { actions as CourseActions } from '../../../../../store/courses';
import { actions } from "../../../../../store/JoinCourse";

import { JoinCourse } from "../join"
import { CourseDeleteDialog } from "./CourseDeleteDialog"

import { ICourses } from "../../../../../store/types"

import * as constStyles from '../../../../../const/styles'

export const STCourseList: FC = () => {
    const dispatch = useAppDispatch()
    const history = useNavigate()
    const isLoading = useAppSelector(state => state.courses.isLoading)
    const isLock = useAppSelector(state => state.courses.isLock)
    const error = useAppSelector(state => state.courses.error)
    const courses = useAppSelector(state => state.courses.payload)
    const deleteStatus = useAppSelector(state => state.joinCourse.deleteStatus)
    const [newJoinCourse, setNewJoinCourse] = useState(false)
    const [dialogCourseStatus, setDialogCourseStatus] = useState(false)
    const [currentCourse, setCurrentCourse] = useState<ICourses>()

    useEffect(() => {
        dispatch(fetchCourses())
        setNewJoinCourse(false)
    }, [dispatch])

    useEffect(() => {
        if (deleteStatus) {
            setDialogCourseStatus(false)
            dispatch(actions.courseSetInitialState())
            dispatch(fetchCourses())
        }
    }, [dispatch, deleteStatus])

    const onJoinNewCourse = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setNewJoinCourse(prev => !prev)
    }

    const onCourse = (id: string) => {
        history(generatePath(
            paths.student.courses.course, { courseId: id }
        ))
    }
    
    const onCourseDelete = useCallback((course: ICourses) => {
        setCurrentCourse(course)
        setDialogCourseStatus(prev => !prev)
    }, [])

    useEffect(() => {
        if (error) {
            dispatch(CourseActions.fetchStarted())
            history(paths.notFound)
        }
    }, [error])

    return (
        <>
            <Box sx={constStyles.container}>
                <Box sx={styles.wrapper}>
                    <WorkBox
                        error={error}
                        isLoading={isLoading}
                        isLock={isLock}
                    >
                        <Box sx={styles.topContainer}>
                            <Typography
                                variant='h6'
                                sx={styles.title}
                            >
                                Все курсы
                            </Typography>

                            <Button
                                variant='contained'
                                sx={styles.addBt}
                                onClick={onJoinNewCourse}
                            >
                                Присоединиться
                            </Button>
                        </Box>

                        <Box sx={styles.root}>
                            {courses && (courses.length > 0) && (
                                <List
                                    items={courses}
                                    renderItems={
                                        (course) =>
                                            <CourseCard
                                                onCourseSelect={onCourse}
                                                onCourseDelete={onCourseDelete}
                                                key={course.id}
                                                course={course}
                                            />
                                    }
                                />
                            )}
                        </Box>

                        {courses && (courses.length === 0) && (
                            <NoData
                                label={"Курсы не найдены. Вы можете присоединиться по коду курса"}
                            />
                        )}
                    </WorkBox>
                </Box>
            </Box>

            <JoinCourse
                popupOpen={newJoinCourse}
                onCloseHandler={setNewJoinCourse}
            />

            <CourseDeleteDialog
                dialogOpen={dialogCourseStatus}
                onCloseHandler={setDialogCourseStatus}
                course={currentCourse}
            />
        </>
    )
}

const styles = {
    wrapper: {
        margin: "20px 0px"
    } as SxProps<Theme>,
    root: {
        display: "grid",
        gridGap: "10px",
        gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr) )",

    } as SxProps<Theme>,
    topContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0px 0px 20px 0px'
    } as SxProps<Theme>,
    title: {
        color: '#273AB5'
    } as SxProps<Theme>,
    addBt: {
        padding: '10px 30px 10px 10px',
        lineHeight: '1',
        position: 'relative',
        ":after": {
            content: '"+"',
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: theme => theme.palette.info.main,
            height: '100%',
            width: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            borderRadius: '0px 4px 4px 0px'
        }
    } as SxProps<Theme>,
}