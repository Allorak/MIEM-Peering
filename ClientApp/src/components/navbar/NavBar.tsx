
import { FC } from "react"
import { Typography } from "@mui/material"
import { Box, SxProps, Theme } from "@mui/system"
import { useNavigate, matchPath } from "react-router-dom"

import { paths } from "../../app/constants/paths"
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT"
import { usePrivatePathSt } from "../../app/hooks/usePrivatePathSt"

import { palette } from "../../theme/colors"


export const Navbar: FC = () => {
    const { location, path: pathT } = usePrivatePathT()
    const { path: pathSt } = usePrivatePathSt()
    const history = useNavigate()
    const pathTaskAdd = matchPath('/t/course/:courseId/task/add', location.pathname)

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
        const courseItem = FakeData[0]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={courseItem.id} courseTitle={courseItem.title} />
        </>)
    }

    if (pathT && pathT.courseId && pathT.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={courseItem.id} courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem courseId={courseItem.id} />
            <SpanDelimetr />
            <TaskTitle courseId={courseItem.id} taskTitle={taskItem.title} taskId={taskItem.id} />

        </>)
    }

    if (pathSt && pathSt.courseId && !pathSt.taskId) {
        const courseItem = FakeData[0]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={courseItem.id} courseTitle={courseItem.title} />
        </>)
    }



    if (pathSt && pathSt.courseId && pathSt.taskId) {
        const courseItem = FakeData[0]
        const taskItem = FakeData[1]
        return (<>
            <CourseItem />
            <SpanDelimetr />
            <CourseTitle courseId={courseItem.id} courseTitle={courseItem.title} />
            <SpanDelimetr />
            <TaskItem courseId={courseItem.id} />
            <SpanDelimetr />
            <TaskTitle courseId={courseItem.id} taskTitle={taskItem.title} taskId={taskItem.id} />

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