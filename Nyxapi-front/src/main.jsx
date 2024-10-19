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
import SharedWithMe from './pages/SharedWithMe.jsx';
import Usage from './pages/Usage.jsx';

// Define router configuration
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>  
        <Route path="" element={<Homepage />} />  
        <Route path="auth" element={<Auth />} /> 
      </Route>

      <Route path="/dashboard" element={<Layout />}> 
        <Route path="" element={<Projects />} />  
        <Route path="shared" element={<SharedWithMe/>}/>
        <Route path="endpoints/:Projectid" element={<Endpoint />} />  
        <Route path="usage" element={<Usage/>} />
      </Route>
      <Route path="*" element={<NotFound />} /> 
    </>
  )
);

// Render the router provider
createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
