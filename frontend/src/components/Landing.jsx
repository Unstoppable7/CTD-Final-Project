import { Link } from "react-router-dom";
import styles from "../css/Landing.module.css"

export default function Landing() {
   return (
      <div className={styles.landingPage}>
         <section className={styles.heroSection}>
            <div className={styles.textSection}>
               <h1 className={styles.h1}>TO-Day App</h1>
               <h2 className={styles.h2}>Mejora tu productividad con nuestro gestor de tareas</h2>
               <p className={styles.p}>Organiza, prioriza y alcanza tus metas.</p>
            </div>
            <div className={styles.ctaButtons}>
               <Link to="/signin" className={`${styles.btn} ${styles.signinButton}`}>Iniciar Sesión</Link>
               <Link to="/signup" className={`${styles.btn} ${styles.signupButton}`}>Registrarse</Link>
            </div>
         </section>
      </div>
   );
}