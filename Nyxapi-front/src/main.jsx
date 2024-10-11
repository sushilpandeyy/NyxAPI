import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Homepage from './pages/Homepage.jsx'
<<<<<<< Updated upstream
import Auth from './components/auth.jsx';
import Dashboard from './components/dashboard.jsx';
import Endpoint from './components/apiEndpoint.jsx'
=======

>>>>>>> Stashed changes
const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Homepage/>}/>
<<<<<<< Updated upstream
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/endpoint" element={<Endpoint />} />
=======
>>>>>>> Stashed changes
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)