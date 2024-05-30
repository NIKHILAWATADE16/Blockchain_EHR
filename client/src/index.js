import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

import Register from './Pages/Register';
import PatientDashboard from './Pages/PatientDashboard';
import DoctorDashboard from './Pages/DoctorDashboard';
import PBookAppointment from './Pages/PBookAppointment';
const router = createBrowserRouter([
  {
    path:'/',
    element:<Register/>,
  },
  {
    path:'/doctorDashboard',
    element:<DoctorDashboard/>
  },
  {
    path:'/patientDashboard',
    element:<PatientDashboard/>
  },
  {
    path:'pAppointments',
    element:<PBookAppointment/>
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
