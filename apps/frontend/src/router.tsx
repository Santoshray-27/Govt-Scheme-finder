import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProfileBuilder from './pages/ProfileBuilder';
import Schemes from './pages/Schemes';
import SchemeDetail from './pages/SchemeDetail';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'profile-builder',
        element: <ProfileBuilder />,
      },
      {
        path: 'schemes',
        element: <Schemes />,
      },
      {
        path: 'scheme/:id',
        element: <SchemeDetail />,
      },
      {
        path: 'recommendations',
        element: <Dashboard />, // Reusing dashboard for recommendations view
      },
    ],
  },
]);
