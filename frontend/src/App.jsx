import { Outlet, Link } from "react-router-dom";

function App() {
   return (
      <>
         <div id="sidebar">
            <h1>TO-Day App</h1>
            <nav>
               <ul>
                  <li>
                     <Link to={`signin`}>Sign in</Link>
                  </li>
                  <li>
                     <Link to={`signup`}>Sign up</Link>
                  </li>
               </ul>
            </nav>
         </div>
         <div id="detail">
            <Outlet />
         </div>
      </>
   );
}

export default App
