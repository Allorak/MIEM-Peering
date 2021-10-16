import { Typography } from "@mui/material"
import { Box, SxProps, Theme } from "@mui/system"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { paths } from "../../app/constants/paths"
import { usePrivatePathT } from "../../app/hooks/usePrivatePathT"
import { palette } from "../../theme/colors"

export const Navbar: FC = () => {

    const { location, path: pathT } = usePrivatePathT()
    const history = useNavigate()

    const CourseItem: FC = () => {
        return (
            <Typography variant='h6'
                sx={{ ...styles.item, ...styles.itemHover }}
                onClick={() => { history(paths.teacher.main) }}
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
                sx={{ ...styles.item, ...styles.itemHover, ...styles.blue }}
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
                sx={styles.item}

            >
                {' / '}
            </Typography>
        )
    }

    if (location.pathname === paths.teacher.main || location.pathname === paths.student.main) {
        return <CourseItem />
    }

    if (pathT && pathT.courseId && !pathT.taskId) {
        //получаем title у курса с помощью redux по path.courseId
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

    console.log('Navbar return null...')

    return null
}

const styles = {
    item: {
        fontSize: '18px',
        display: 'inline',
        lineHeight: '34px',
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