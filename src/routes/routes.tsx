import React, { Component, ErrorInfo } from 'react';
import type { Router as RemixRouter } from '@remix-run/router';
import { Outlet, RouteObject } from 'react-router';
import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../components/not-found/NotFound';
import NavigationBar from '../components/navigation-bar/NavigationBar';
import { Endpoint } from './endpoint';
import Home from '../pages/home/Home.tsx';
import Profile from '../pages/profile/Profile';
import Statistics from '../pages/statistics/Statistics';
import Career from '../pages/career/Career';
import Feedback from '../pages/feedback/Feedback';
import Wiki from '../pages/wiki/Wiki';
import Register from '../pages/register/Register';
import Login from '../pages/login/LogIn';
import ProtectedRoute from './ProtectedRoute.tsx';
import Goals from '../pages/goals/Goals.tsx';
import PrivacyPolicy from '../pages/privacy-policy/PrivacyPolicy.tsx';
import Tos from '../pages/tos/Tos.tsx';
import CareerPaths from '../pages/career/CareerPaths.tsx';
import ReviewPortal from '../pages/review-portal/ReviewPortal.tsx';

type MyErrorBoundaryProps = {
  children: React.ReactNode;
};

class MyErrorBoundary extends Component<MyErrorBoundaryProps> {
  state = {
    hasError: false
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
    path: Endpoint.LOGIN,
    element: <Login />
  },
  {
    path: Endpoint.REGISTER,
    element: <Register />
  },
  {
    path: Endpoint.TOS,
    element: <Tos />
  },
  {
    path: Endpoint.PRIVACY_POLICY,
    element: <PrivacyPolicy />
  },
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
        element: <ProtectedRoute path={Endpoint.MAIN_PAGE} element={<Home />} />
      },
      {
        path: Endpoint.STATISTICS,
        element: <ProtectedRoute path={Endpoint.STATISTICS} element={<Statistics />} />
      },
      {
        path: Endpoint.CAREER,
        element: <ProtectedRoute path={Endpoint.CAREER} element={<Career />} />
      },
      {
        path: Endpoint.FEEDBACK,
        element: <ProtectedRoute path={Endpoint.FEEDBACK} element={<Feedback />} />
      },
      {
        path: Endpoint.WIKI,
        element: <ProtectedRoute path={Endpoint.WIKI} element={<Wiki />} />
      },
      {
        path: Endpoint.PROFILE,
        element: <ProtectedRoute path={Endpoint.PROFILE} element={<Profile />} />
      },
      {
        path: Endpoint.GOALS,
        element: <ProtectedRoute path={Endpoint.GOALS} element={<Goals />} />
      },
      {
        path: Endpoint.CAREER_PATHS,
        element: <ProtectedRoute path={Endpoint.CAREER_PATHS} element={<CareerPaths />} />
      },
      {
        path: Endpoint.REVIEW_PORTAL,
        element: <ProtectedRoute path={Endpoint.REVIEW_PORTAL} element={<ReviewPortal />} />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export const routes: RemixRouter = createBrowserRouter(routeOptions);
