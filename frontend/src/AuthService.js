class AuthService {
   constructor() {
      this._isAuthenticated = false;
      this._user = {};
   }
   get isAuthenticated() {
      return this._isAuthenticated;
   }
   set isAuthenticated(value) {
      if (typeof value !== "boolean") {
         throw new Error("isAuthenticated must be a boolean value");
      }
      this._isAuthenticated = value;
   }
   get user() {
      return this._user;
   }
   set user(value) {
      if (typeof value !== "object") {
         throw new Error("user must be a object value");
      }
      this._user = value;
   }
   async validateSession() {
      try {
         const response = await fetch(import.meta.env.VITE_API_AUTH_CHECK_URL, {
            method: "GET",
            credentials: "include",
         });
         if (!response.ok) {
            const json = await response.json();
            return { success: false, message: json.message };
         }
         this.isAuthenticated = true;
         const result = await response.json();
         this.user = result.user;
         return { success: true, user: result.user };
      } catch (error) {
         this.isAuthenticated = false;
         this.user = {};
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during session validation",
         };
      }
   }
   async checkAuthentication() {
      if (!this.isAuthenticated) {
         console.log("NOT AUTHENTICATED");
         const response = await this.validateSession();
         if (!response.success) {
            console.log("NOT VALIDATE SESSION");
            return response;
         }
         console.log("VALIDATE SESSION");
         return response;
      } else {
         console.log("AUTHENTICATED");
         return { success: this.isAuthenticated , user: this.user};
      }
   }
   async signup(data) {
      const options = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
         }),
      };

      try {
         let response = await fetch(
            import.meta.env.VITE_API_AUTH_SIGNUP_URL,
            options
         );
         return await this.handleFetchAuthError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message || "An unexpected error occurred during sign up",
         };
      }
   }
   async signin(data) {
      const options = {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         credentials: "include",
         body: JSON.stringify({
            email: data.email,
            password: data.password,
         }),
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_AUTH_SIGNIN_URL,
            options
         );
         return await this.handleFetchAuthError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message || "An unexpected error occurred during sign in",
         };
      }
   }
   async signout() {
      try {
         const response = await fetch(
            import.meta.env.VITE_API_AUTH_SIGNOUT_URL,
            {
               method: "POST",
               credentials: "include",
            }
         );
         const json = await response.json();
         if (!response.ok) {
            return { success: false, message: json.message };
         }
         this.isAuthenticated = false;
         this.user = {};
      } catch (error) {
         return {
            success: false,
            message:
               error.message || "An unexpected error occurred during sign out",
         };
      }
      return { success: true, message: "Successful sign out" };
   }
   async handleFetchAuthError(response) {
      const json = await response.json();
      if (!response.ok) {
         return { success: false, message: json.message };
      }
      const result = await this.checkAuthentication();
      if (!result.success) {
         return { success: false, message: result.message };
      }
      return {
         success: true,
         message: json.message,
         user: result.user
      };
   }
   userFormValidation(data, form) {
      let errors = {};
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form === "signup") {
         if (!data.name || data.name.trim().length === 0) {
            errors.name = "Name is required";
         }
         if (data.password.trim().length < 6) {
            errors.password = "Password must have at least 6 characters";
         }
      }
      if (!emailRegex.test(data.email)) {
         errors.email = "Email invalid format ";
      }
      if (!data.email || data.email.trim().length === 0) {
         errors.email = "Email is required";
      }
      if (!data.password || data.password.trim().length === 0) {
         errors.password = "Password is required";
      }
      return errors;
   }
}

export const authService = new AuthService();
