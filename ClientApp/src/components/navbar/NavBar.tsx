import { FC } from "react"
import { Typography } from "@mui/material"
import { SxProps, Theme } from "@mui/system"
import { useNavigate, matchPath } from "react-router-dom"

import { paths } from "../../app/constants/paths"
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT"
import { usePrivatePathSt } from "../../app/hooks/usePrivatePathSt"
import { useAppSelector } from "../../app/hooks"

import { palette } from "../../theme/colors"

import { ICourses } from "../../store/types";

export const Navbar: FC = () => {
    const history = useNavigate()

    const { location, path: pathT } = usePrivatePathT()
    const { path: pathSt } = usePrivatePathSt()
    const pathTaskAdd = matchPath('/t/course/:courseId/task/add', location.pathname)
    const courses = useAppSelector(state => state.courses.payload)

    const CurrentCourseTitle: FC<{ courseId: string, courses: Array<ICourses> }> = ({courses, courseId}) => {
        return (
        <>
            {courses.map(item =>  
                (item.id == courseId
                    ? (<CourseTitle key={item.id} courseTitle={item.name} />)
                    : null
            ))}
        </>
    )}

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

    const TaskItem: FC = () => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover }}
            >
                Задания
            </Typography>
        )
    }

    const CourseTitle: FC<{ courseTitle: string }> = ({ courseTitle }) => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.courseTitle, ...styles.blue }}
            >
                {courseTitle}
            </Typography>
        )
    }

    const TaskTitle: FC<{ taskTitle: string }> = ({ taskTitle }) => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover, ...styles.blue }}
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

    if (location.pathname === paths.root || location.pathname === paths.root) {
        return <CourseItem />
    }

    if (courses && pathT && pathT.courseId && !pathT.taskId && !pathTaskAdd) {
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CurrentCourseTitle courses={courses} courseId={pathT.courseId}/>
        </>)
    }

    if (pathT && pathT.courseId && pathT.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem />
            <SpanDelimetr />
            <TaskTitle taskTitle={taskItem.title} />

        </>)
    }

    if (courses && pathSt && pathSt.courseId && !pathSt.taskId) {
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CurrentCourseTitle courses={courses} courseId={pathSt.courseId}/>
        </>)
    }

    if (pathSt && pathSt.courseId && pathSt.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem />
            <SpanDelimetr />
            <TaskTitle taskTitle={taskItem.title}  />

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