import {Typography } from "@mui/material";
import { Box, SxProps, Theme } from "@mui/system";
import { FC, useEffect } from "react";
import List from "../../../../../components/list/List";
import { TaskCard } from "../../../../../components/taskCard";
import { WorkBox } from "../../../../../components/workBox";
import { useNavigate, generatePath } from "react-router-dom"
import { paths } from "../../../../../app/constants/paths";
import { usePrivatePathSt } from "../../../../../app/hooks/usePrivatePathSt";
import { useAppDispatch, useAppSelector } from "../../../../../app/hooks";
import { fetchTasks } from "../../../../../store/tasks/thunks/fetchTasks";
import * as constStyles from '../../../../../const/styles'

export const CourseMain: FC = () => {
    const dispatch = useAppDispatch()
    const history = useNavigate()
    const { location, path } = usePrivatePathSt()
    const isLoading = useAppSelector(state => state.tasks.isLoading)
    const error = useAppSelector(state => state.tasks.error)
    const tasks = useAppSelector(state => state.tasks.payload)

    useEffect(() => {
        if (path?.courseId)
            dispatch(fetchTasks(path.courseId))
    }, [dispatch])

    const onTaskClick = (id: string) => {
        console.log("Task clicked:", id)
        if (path?.courseId) {
            const taskPath = generatePath(paths.student.dashboard.overview, { taskId: id })
            history(taskPath)
        }
    }

    return (
        <Box sx={constStyles.container}>
            <Box sx={styles.wrapper}>
                <WorkBox
                    error={error}
                    isLoading={isLoading}

                >
                    <Box sx={styles.topContainer}>
                        <Typography
                            variant='h6'
                            sx={styles.title}
                        >
                            Задания
                        </Typography>
                    </Box>
                    <Box sx={styles.root}>
                        {tasks && (tasks.length > 0) && (
                            <List
                                items={tasks}
                                renderItems={
                                    (task) => <TaskCard task={task} onClick={onTaskClick} key={task.id} />
                                }
                            />
                        )}
                    </Box>
                </WorkBox>
            </Box>
        </Box>
    )
}

const styles = {
    wrapper: {
        maxWidth: '1371px',
        margin: '20px 0px',
    } as SxProps<Theme>,
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
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