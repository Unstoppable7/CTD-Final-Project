import { authService } from "./AuthService";

class TaskService {
   static async getRootTasks() {
      const options = {
         method: "GET",
         credentials: "include",
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_TASK_ROOT_URL,
            options
         );

         return await this.handleFetchTasksError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during get root tasks",
         };
      }
   }

   static async getChildrenTasks(parentId) {
      const options = {
         method: "GET",
         credentials: "include",
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_TASK_ROOT_URL + `/${parentId}`,
            options
         );

         return await this.handleFetchTasksError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during get children tasks",
         };
      }
   }

   static async createTask(data) {
      const options = {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({
            title: data.title,
            description: data.description || "",
            parentTask: data.parentTask || null,
            subTasks: data.subTasks || [],
            dueDate: data.dueDate || "",
            priority: data.priority || "",
            objectives: {
               hours: data.objectives?.hours || 0,
               quantity: data.objectives?.quantity || 0,
            },
            estimation: {
               hours: data.estimation?.hours || 0,
               quantity: data.estimation?.quantity || 0,
            },
         }),
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_TASK_ROOT_URL,
            options
         );
         return await this.handleFetchTasksError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during create task",
         };
      }
   }

   static async updateTask(data) {
      const options = {
         method: "PATCH",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
         body: JSON.stringify({
            title: data.title,
            description: data.description || "",
            completed: data.completed || false,
            dueDate: data.dueDate || "",
            priority: data.priority || "",
            objectives: {
               hours: data.objectives?.hours || 0,
               quantity: data.objectives?.quantity || 0,
            },
            estimation: {
               hours: data.estimation?.hours || 0,
               quantity: data.estimation?.quantity || 0,
            },
         }),
      };

      try {
         const response = await fetch(
            import.meta.env.VITE_API_TASK_ROOT_URL + `/${data._id}`,
            options
         );
         return await this.handleFetchTasksError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during update task",
         };
      }
   }

   static async deleteTask(parentId, taskId) {
      const options = {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
         },
         credentials: "include",
      };
      try {
         const response = await fetch(
            import.meta.env.VITE_API_TASK_ROOT_URL + `/${parentId}/subtask/${taskId}`,
            options
         );
         return await this.handleFetchTasksError(response);
      } catch (error) {
         return {
            success: false,
            message:
               error.message ||
               "An unexpected error occurred during delete task",
         };
      }
   }

   static async handleFetchTasksError(response) {
      const json = await response.json();

      if (!response.ok) {
         return { success: false, message: json.message };
      }
      return {
         success: true,
         data: json,
      };
   }
}
export default TaskService;
