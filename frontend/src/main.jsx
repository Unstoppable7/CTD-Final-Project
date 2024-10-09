import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from './components/error-page.jsx';
import Signin, { action as signinAction, loader as signinLoader } from './routes/signin.jsx';
import Signup, { action as signupAction, loader as signupLoader } from './routes/signup.jsx';

const router = createBrowserRouter([
   {
      path: "/",
      element:
         <App />,
      errorElement: <ErrorPage />,
      children: [
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
         }
      ]
   },
])

createRoot(document.getElementById('root')).render(
   <StrictMode>
      <RouterProvider router={router} />
   </StrictMode>,
)
