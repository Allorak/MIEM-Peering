import { Routes, Route } from 'react-router-dom'

import { paths } from '../../../app/constants/paths'
import { Box } from '@mui/system'
import { TCourseList as CourseList } from './course/list'
import { CourseMain } from './course/main'
import { TaskAdd } from './task/add'
import { Dashboard } from './dashboard/Dashboard'



export function TeacherPrivate() {
    console.log('Teacher private')

    return (
        <Box>
            <Routes>
                <Route path={paths.teacher.main} element={<CourseList />} />
                <Route path={paths.teacher.courses.course} element={<CourseMain />} />
                <Route path={paths.teacher.task.add} element={<TaskAdd />} />
                <Route path={"*"} element={<Dashboard />} />
            </Routes>
        </Box>

    )
}