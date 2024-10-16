import { Outlet, Link, useLoaderData } from "react-router-dom";
import styles from "./css/Nav.module.css"
import { authService } from "./AuthService";

export async function loader() {
   return await authService.checkAuthentication();
}

export default function App() {
   const auth = useLoaderData();
   return (
      <>
         <nav className={styles.navbar}>
            <div>
               <Link className={styles.logo} to="/">TO-Day App</Link>
            </div>
            <ul className={styles.navLinks}>
               {!auth.success && (
                  <>
                     <li>
                        <Link to={`signin`} className={`${styles.btn} ${styles.signinButton}`}>Sign in</Link>
                     </li>
                     <li>
                        <Link to={`signup`} className={`${styles.btn} ${styles.signupButton}`}>Sign up</Link>
                     </li>
                  </>
               )}
               {auth.success && (
                  <li>
                     <Link to={`signout`} className={`${styles.btn} ${styles.signoutButton}`}>Sign out</Link>
                  </li>
               )}
            </ul>
         </nav>
         <div>
            <Outlet />
         </div>
      </>
   );
}
