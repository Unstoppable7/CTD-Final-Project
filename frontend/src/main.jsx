import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App, { loader as appLoader } from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './routes/error-page.jsx';
import Signin, { action as signinAction, loader as signinLoader } from './routes/signin.jsx';
import Signup, { action as signupAction, loader as signupLoader } from './routes/signup.jsx';
import Tasks, { loader as tasksLoader } from './routes/tasks.jsx';
import Landing, { loader as landingLoader } from './routes/landing.jsx';

const router = createBrowserRouter([
   {
      path: "/",
      element:
         <App />,
      loader: appLoader,
      errorElement: <ErrorPage />,
      children: [
         {
            index: true,
            element: <Landing />,
            loader: landingLoader,
         },
         {
            path: "signin",
            element: <Signin />,
            action: signinAction,
            loader: signinLoader
         },
         {
            path: "signup",
            element: <Signup />,
            action: signupAction,
            loader: signupLoader
         },
         {
            path: import.meta.env.VITE_CLIENT_TASK_ROOT_URL,
            element: <Tasks />,
            loader: tasksLoader
         },
      ]
   }
])

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <RouterProvider router={router} />
   </StrictMode>
)
