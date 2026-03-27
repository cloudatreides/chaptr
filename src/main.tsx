import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import './index.css';
import LandingPage from './pages/LandingPage';
import UniversesPage from './pages/UniversesPage';
import StoryReaderPage from './pages/StoryReaderPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/universes',
    element: <UniversesPage />,
  },
  {
    path: '/story/:chapterId',
    element: <StoryReaderPage />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
