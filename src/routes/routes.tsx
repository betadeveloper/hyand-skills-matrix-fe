import React, { Component, ErrorInfo } from 'react';
import type { Router as RemixRouter } from '@remix-run/router';
import { Outlet, RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../components/not-found/NotFound';
import NavigationBar from '../components/navigation-bar/NavigationBar';
import { Endpoint } from './endpoint';
import MainPage from '../pages/main-page/MainPage';
import Profile from '../pages/profile/Profile';
import Statistics from '../pages/statistics/Statistics';
import Career from '../pages/career/Career';
import Feedback from '../pages/feedback/Feedback';
import Wiki from '../pages/wiki/Wiki';

type MyErrorBoundaryProps = {
  children: React.ReactNode;
};

class MyErrorBoundary extends Component<MyErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <NotFound />;
    }

    return this.props.children;
  }
}

const routeOptions: RouteObject[] = [
  {
    element: (
      <>
        <NavigationBar />
        <MyErrorBoundary>
          <div className="content">
            <Outlet />
          </div>
        </MyErrorBoundary>
      </>
    ),
    children: [
      {
        path: Endpoint.MAIN_PAGE,
        element: <MainPage />,
      },
      {
        path: Endpoint.STATISTICS,
        element: <Statistics />,
      },
      {
        path: Endpoint.CAREER,
        element: <Career />,
      },
      {
        path: Endpoint.FEEDBACK,
        element: <Feedback />,
      },
      {
        path: Endpoint.WIKI,
        element: <Wiki />,
      },
      {
        path: Endpoint.PROFILE,
        element: <Profile />,
      },
    ],
  },
  // {
  //   path: Endpoint.LOGIN,
  //   element: <Login />,
  // },
  // {
  //   path: Endpoint.REGISTER,
  //   element: <Register />,
  // },
  {
    path: '*',
    element: <NotFound />,
  },
];

export const routes: RemixRouter = createBrowserRouter(routeOptions);
