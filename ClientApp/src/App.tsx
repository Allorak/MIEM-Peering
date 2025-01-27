import * as React from 'react';
import { Box } from '@mui/material';
import { BrowserRouter, Route, RouteProps, Routes } from 'react-router-dom';

import { Login } from './pages/login';
import { Registration } from './pages/private/registration';
import { Role } from './pages/private/registration/role';

import { paths } from './app/constants/paths';
import { Wrapper } from './components/wrapper';
import { Private } from './pages/private/Private';

import { TestPage } from './pages/test';
import { Error404 } from './pages/error404';

import "../node_modules/react-vis/dist/style.css";


export default () => (
  <BrowserRouter>
    <Box>
      <Wrapper >
        <Routes>
          <Route path={paths.login} element={<Login />} />
          <Route path={paths.registration.main} element={<Registration />} />
          <Route path={paths.registration.selectRole} element={<Role />} />
          <Route path={'/test'} element={<TestPage />} />
          <Route path={paths.notFound} element={<Error404 />} />
          <PrivateRoute path={'*'} element={<Private />} />
        </Routes>
      </Wrapper>
    </Box>
  </BrowserRouter>
);

function PrivateRoute(props: RouteProps): React.ReactElement | null {
  return (
    <Route {...props} />
  )
}