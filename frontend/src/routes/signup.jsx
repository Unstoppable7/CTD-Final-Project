import { Form, redirect, useActionData, useLocation, useNavigation } from "react-router-dom";
import { authService } from "../AuthService";
import styles from "../css/Authentication.module.css"

export async function loader() {
   if ((await authService.validateSession()).success) {
      return redirect(import.meta.env.VITE_CLIENT_TASK_ROOT_URL);
   }
   return null;
}

export async function action({ request }) {
   const formData = await request.formData();
   const data = Object.fromEntries(formData);
   let result = { success: "", message: "" }

   let errorsObj = authService.userFormValidation(data, "signup");
   if (Object.keys(errorsObj).length > 0) {
      let errors = Object.values(errorsObj).join("\n");
      result = { success: false, message: errors };
      return result;
   }

   result = await authService.signup(data);

   if (!result.success) {
      return result;
   }
   return redirect(formData.get("redirectTo"));
}
export default function Signup() {
   let location = useLocation();
   let params = new URLSearchParams(location.search);
   let from = params.get("from") || import.meta.env.VITE_CLIENT_TASK_ROOT_URL;

   let navigation = useNavigation();
   let isSigningUp = navigation.formData?.get("name") != null && navigation.formData?.get("email") != null && navigation.formData?.get("password") != null;
   let actionData = useActionData();

   return (
      <div className={styles.container}>
         <div className={styles.card}>
            <h1>Sign up</h1>
            <Form method="post">
               <input type="hidden" name="redirectTo" value={from} />
               <label className={styles.label} htmlFor="name">Name</label>
               <input className={styles.input} autoComplete="true" type="text" id="name" name="name" />
               <label className={styles.label} htmlFor="email">Email</label>
               <input className={styles.input} autoComplete="true" type="email" id="email" name="email" />
               <label className={styles.label} htmlFor="password">Password</label>
               <input className={styles.input} type="password" id="password" name="password" />
               <button className={styles.button} type="submit" disabled={isSigningUp}>
                  {isSigningUp ? "Signing up..." : "Submit"}
               </button>
               {actionData ? (
                  <p className={`${styles.message} ${actionData.success ? styles.success : styles.error}`}>
                     {actionData.message}
                  </p>
               ) : null}
            </Form>
         </div>
      </div>
   );
} 