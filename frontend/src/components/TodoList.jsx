import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import TaskService from "../TaskService";
import AddTodoForm from "./AddTodoForm";

export default function TodoList({ initialData, parentId, toggleHandleByParent, sorter, onAddTodoForm }) {
   const [data, setData] = useState(initialData);
   const [isLoading, setIsLoading] = useState(false);
   const [showAddTodoForm, setShowAddTodoForm] = useState(false);

   useEffect(() => {
      // setIsLoading(false);
      console.log("data: ", data);
   });
   
   useEffect(() => {
      setShowAddTodoForm(onAddTodoForm);
   }, [onAddTodoForm]);

   useEffect(() => {
      if (!toggleHandleByParent && data.length === 0 && parentId) {
         fetchData();
      }
   }, [toggleHandleByParent])

   const fetchData = async () => {
      setIsLoading(true);

      const result = await TaskService.getTasks(parentId);
      console.log("Fetch: ", result);

      //TODO manejo de errores
      if (!result.success) {
         throw json({ message: result.message });
      }
      setData(result.data);
      setIsLoading(false);
   }

   const postTodo = async (todo) => {
      setIsLoading(true);
      const originalItems = [...data];
      const response = await TaskService.createTask({ ...todo, parentTask: parentId });
      //TODO manejar mensaje de error
      if (!response.success) {
         setData(originalItems);
         throw Error(response.message);
      }
      addTodo(response.data);
      setIsLoading(false);
   }

   const addTodo = (newTodo) => {
      setData((previousTodoList) => {
         const newList = [...previousTodoList, newTodo].sort(sorter);
         return newList;
      });
   }

   const updateTodo = async (todo) => {
      setIsLoading(true);

      const originalItems = [...data];
      const response = await TaskService.updateTask(todo);
      //TODO manejar mensaje de error
      if (!response.success) {
         setData(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }

      setData((previousTodoList) =>
         previousTodoList.map((item) => {
            return item._id === todo._id ? { ...response.data } : item;
         })
      );
      setIsLoading(false);
   }

   const deleteTodo = async (itemId) => {
      setIsLoading(true);

      const originalItems = [...data];
      const response = await TaskService.deleteTask(0, itemId);
      //TODO manejar mensaje de error
      if (!response.success) {
         setData(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      removeTodo(itemId);
      setIsLoading(false);
   }

   const removeTodo = (todoId) => {
      const newTodoList = data.filter((item) => item._id != todoId);
      setData(newTodoList);
   }

   return (
      <div>
         {isLoading ? <p>Loading...</p> : ""}
         {!isLoading && (data && data.length > 0) && (
            data.map((todo) => {
               return (<TodoItem key={todo._id} item={todo} toggleHandleByParent={toggleHandleByParent} onCheckedItem={() => updateTodo({ _id: todo._id, completed: !todo.completed })} onDeleteItem={() => deleteTodo(todo._id)} sorter={sorter} />);
            })
         )}
         {!isLoading && showAddTodoForm && (
            <AddTodoForm onAddTodo={postTodo} />
         )}
      </div>
   );
}