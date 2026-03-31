import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import AppShell from './components/AppShell';
import LandingPage from './pages/LandingPage';
import UniversesPage from './pages/UniversesPage';
import StoryReaderPage from './pages/StoryReaderPage';
import ProfilePage from './pages/ProfilePage';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/universes', element: <UniversesPage /> },
      { path: '/story/:chapterId', element: <StoryReaderPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
