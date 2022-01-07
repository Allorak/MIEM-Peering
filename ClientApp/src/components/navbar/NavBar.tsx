import { FC, useEffect } from "react"
import { Typography } from "@mui/material"
import { SxProps, Theme } from "@mui/system"
import { useNavigate, matchPath } from "react-router-dom"

import { paths } from "../../app/constants/paths"
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT"
import { usePrivatePathSt } from "../../app/hooks/usePrivatePathSt"
import { useAppDispatch, useAppSelector } from "../../app/hooks"

import { palette } from "../../theme/colors"

import { fetchCourses } from "../../store/courses/thunks/courses"


export const Navbar: FC = () => {
    const dispatch = useAppDispatch()
    const history = useNavigate()

    const { location, path: pathT } = usePrivatePathT()
    const { path: pathSt } = usePrivatePathSt()
    const pathTaskAdd = matchPath('/t/course/:courseId/task/add', location.pathname

    const courses = useAppSelector(state => state.courses.payload)

    useEffect(() => {
        dispatch(fetchCourses())
    }, [])

    const CourseItem: FC = () => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover }}
                onClick={() => { history(pathT ? paths.teacher.main : paths.student.main) }}
            >
                Мои курсы
            </Typography>
        )
    }

    const TaskItem: FC<{ courseId: string }> = ({
        courseId
    }) => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover }}
                onClick={() => { console.log(courseId, "Get all tasks") }}
            >
                Задания
            </Typography>
        )
    }

    const CourseTitle: FC<{ courseId: string, courseTitle: string }> = ({ courseId, courseTitle }) => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.courseTitle, ...styles.itemHover, ...styles.blue }}
                onClick={() => console.log(courseId)}
            >
                {courseTitle}
            </Typography>
        )
    }

    const TaskTitle: FC<{ courseId: string, taskId: string, taskTitle: string }> = ({ courseId, taskId, taskTitle }) => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover, ...styles.blue }}
                onClick={() => console.log(courseId, taskId, "Get task")}
            >
                {taskTitle}
            </Typography>
        )
    }

    const SpanDelimetr: FC = () => {
        return (
            <Typography
                variant='h6'
                sx={{ ...styles.item, ...styles.spanDelimeter }}
            >
                {' / '}
            </Typography>
        )
    }

    if (location.pathname === paths.teacher.main || location.pathname === paths.student.main) {
        return <CourseItem />
    }

    if (pathT && pathT.courseId && !pathT.taskId && !pathTaskAdd) {
        return (<>
            <CourseItem />
            <SpanDelimetr />
            {courses.map(item =>  
            (item.id == pathT.courseId
                ? (<CourseTitle courseId={item.id} courseTitle={item.name} />)
                : null
            ))}
        </>)
    }

    if (pathT && pathT.courseId && pathT.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={pathT.courseId} courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem courseId={pathT.courseId} />
            <SpanDelimetr />
            <TaskTitle courseId={pathT.courseId} taskTitle={taskItem.title} taskId={taskItem.id} />

        </>)
    }

    if (pathSt && pathSt.courseId && !pathSt.taskId) {
        return (<>
            <CourseItem />
            <SpanDelimetr />
            {courses.map(item =>  
            (item.id == pathSt.courseId
                ? (<CourseTitle courseId={item.id} courseTitle={item.name} />)
                : null
            ))}
        </>)
    }

    if (pathSt && pathSt.courseId && pathSt.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={pathSt.courseId} courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem courseId={pathSt.courseId} />
            <SpanDelimetr />
            <TaskTitle courseId={pathSt.courseId} taskTitle={taskItem.title} taskId={taskItem.id} />

        </>)
    }

    return null
}

const styles = {
    item: {
        fontSize: '16px',
        display: 'inline',
        lineHeight: '34px',
        '@media (min-width: 1280px)': {
            fontSize: '18px',
        }
    } as SxProps<Theme>,
    spanDelimeter: {
        padding: '0 4px'
    } as SxProps<Theme>,
    courseTitle: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    } as SxProps<Theme>,
    itemHover: {
        ':hover': {
            cursor: 'pointer',
            textDecoration: 'underline'
        }
    } as SxProps<Theme>,

    blue: {
        color: palette.active.primary
    } as SxProps<Theme>

}

const FakeData = [
    {
        id: '123',
        title: 'Математика'
    },
    {
        id: '124',
        title: 'Решение уравнение'
    },
]