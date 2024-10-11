import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';

// Import components/pages
import App from './App.jsx';
import Homepage from './pages/Homepage.jsx';
import Auth from './components/auth.jsx';
import Endpoint from './components/apiEndpoint.jsx';
import Layout from './pages/Layout.jsx';
import Projects from './pages/Projects.jsx';
import NotFound from './pages/404.jsx';

// Define router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}> {/* Parent: App */}
        <Route path="" element={<Homepage />} /> {/* Homepage */}
        <Route path="auth" element={<Auth />} /> {/* Auth */}
      </Route>

      <Route path="/dashboard" element={<Layout />}> {/* Parent: Dashboard layout */}
        <Route path="" element={<Projects />} /> {/* Projects */}
        <Route path="endpoints" element={<Endpoint />} /> {/* Endpoints */}
      </Route>
      <Route path="*" element={<NotFound />} /> 
    </>
  )
);

// Render the router provider
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
