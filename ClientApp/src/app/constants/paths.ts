export const paths = {
  root: '/',
  login: '/login',
  notFound: '/404', // TODO

  registration: {
    main: '/registration',
    selectRole: '/registration/select-role'

  },
  teacher: {
    main: '/t/course',
    courses: {
      course: '/t/course/:courseId/main'
    },
    task: {
      main: '/t/course/:courseId/task/:taskId/main', // TO DO страница статистики
      add: '/t/course/:courseId/task/add'
    },
    dashboard: {
      statistics: '/t/task/:taskId/statistics',
      
    }

  },
  student: {
    main: '/st/course',
    courses: {
      course: '/st/course/:courseId/main'
    },
  }
}
