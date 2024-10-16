import { Link, redirect } from "react-router-dom";
import styles from "../css/Landing.module.css"
import { authService } from "../AuthService";

export async function loader() {
   if ((await authService.validateSession()).success) {
      return redirect(import.meta.env.VITE_CLIENT_TASK_ROOT_URL);
   }
   return null;
}

export default function Landing() {
   return (
      <div className={styles.landingPage}>
         <section className={styles.heroSection}>
            <div className={styles.textSection}>
               <h1 className={styles.h1}>TO-Day App</h1>
               <h2 className={styles.h2}>Improve your productivity with our task manager</h2>
               <p className={styles.p}>Organize, prioritize and achieve your goals.</p>
            </div>
            <div className={styles.ctaButtons}>
               <Link to="/signin" className={`${styles.btn} ${styles.signinButton}`}>Sign In</Link>
               <Link to="/signup" className={`${styles.btn} ${styles.signupButton}`}>Sign Up</Link>
            </div>
         </section>
      </div>
   );
}