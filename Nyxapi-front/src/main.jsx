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
import Auth from './components/auth.jsx';

const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Homepage/>}/>
      <Route path="/auth" element={<Auth />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
)