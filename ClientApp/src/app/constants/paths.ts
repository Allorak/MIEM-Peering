export const paths = {
  root: '/',
  login: '/login',
  notFound: '/not-found',

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
      overview: '/t/task/:taskId/overview',
      grades: '/t/task/:taskId/grades',
      experts: '/t/task/:taskId/experts',
      works: '/t/task/:taskId/works',
      checkings: '/t/task/:taskId/checkings'
    }
  },
  student: {
    main: '/st/course',
    courses: {
      course: '/st/course/:courseId/main'
    },
    dashboard: {
      overview: '/st/task/:taskId/overview',
      authorform: '/st/task/:taskId/authorform',
      work: '/st/task/:taskId/work',
      checkings: '/st/task/:taskId/checkings'
    }
  },
  expert: {
    dashboard: {
      overview: '/ex/task/:taskId/overview',
      checkings: '/ex/task/:taskId/checkings'
    }
  }
}