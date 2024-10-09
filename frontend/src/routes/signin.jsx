import { Form, redirect, useActionData, useLocation, useNavigation } from "react-router-dom";
import { authService } from "../AuthService";

export async function loader() {
   if ((await authService.checkAuthentication()).success) {
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
      <div>
         <p>You must log in to view the page at {from}</p>
         <Form method="post">
            <input type="hidden" name="redirectTo" value={from} />
            <label htmlFor="email">Email</label>
            <input autoComplete="true" type="email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
            <button type="submit" disabled={isLoggingIn}>{isLoggingIn ? "Signing in..." : "Sign in"}</button>
            {actionData ? (
               <p style={actionData.success ? { color: "green", whiteSpace: "pre-line" } : { color: "red", whiteSpace: "pre-line" }}>{actionData.message}</p>
            ) : null}
         </Form>
      </div>
   );
} 