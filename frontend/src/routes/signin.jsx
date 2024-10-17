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

   let errorsObj = authService.userFormValidation(data, "signin");
   if (Object.keys(errorsObj).length > 0) {
      let errors = Object.values(errorsObj).join("\n");
      result = { success: false, message: errors };
      return result;
   }

   result = await authService.signin(data);

   console.log("redirectTo: ", formData.get("redirectTo"));
   console.log("Result Sign in Action: ", result);
   console.log("Data Sign in Action: ", data);

   if (!result.success) {
      return result
   }

   return redirect(formData.get("redirectTo"));
}

export default function Signin() {
   let location = useLocation();
   let params = new URLSearchParams(location.search);
   let from = params.get("from") || import.meta.env.VITE_CLIENT_TASK_ROOT_URL;

   let navigation = useNavigation();
   let isLoggingIn = navigation.formData?.get("email") != null && navigation.formData?.get("password") != null;
   let actionData = useActionData();

   return (
      <div className={styles.container}>
         <div className={styles.card}>
            <h1>Sign in</h1>
            <Form method="post">
               <input type="hidden" name="redirectTo" value={from} />
               <label className={styles.label} htmlFor="email">Email</label>
               <input className={styles.input} autoComplete="true" type="email" id="email" name="email" />
               <label className={styles.label} htmlFor="password">Password</label>
               <input className={styles.input} type="password" id="password" name="password" />
               <button className={styles.button} type="submit" disabled={isLoggingIn}>
                  {isLoggingIn ? "Signing in..." : "Submit"}
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