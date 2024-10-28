import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';

// Import components/pages
import App from './App';
import Homepage from './pages/Homepage';
import Auth from './components/Auth';
import Endpoint from './components/ApiEndpoint';
import Layout from './pages/Layout';
import Projects from './pages/Projects';
import NotFound from './pages/404';
import SharedWithMe from './pages/SharedWithMe';
import Usage from './pages/Usage';
import SavedEndpoints from './components/SavedEndpoints';
import EndpointScreen from './pages/Endpoints';
import Shared from './pages/Shared';

// Define router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route index element={<Homepage />} />
      <Route path="login" element={<Auth />} />

      {/* Dashboard Routes */}
      <Route path="dashboard" element={<Layout />}>
        <Route index element={<Projects />} />
        <Route path="share" element={<Shared />} />
        <Route path="endpoints/:Projectid" element={<EndpointScreen />} />
        <Route path="billing" element={<Usage />} />
        <Route path="saved" element={<SavedEndpoints />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

// Render the router provider
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
