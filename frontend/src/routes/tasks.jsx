import PropTypes from "prop-types";
import TodoList from "../components/TodoList";
import { useEffect, useState } from "react";
import TaskService from "../TaskService";
import { useLoaderData } from "react-router-dom";
import AddTodoForm from "../components/AddTodoForm"

export async function loader() {
   const result = await TaskService.getRootTasks();
   if (!result.success) {
      throw Error(result.message);
   }
   return result.data;
}

export default function Tasks() {
   const [todoList, setTodoList] = useState(useLoaderData());
   const [isLoading, setIsLoading] = useState(true);
   const [sort, setSort] = useState({ field: 'priority', asc: true });
   const sortData = (objA, objB) => {
      const fieldA = objA[sort.field];
      const fieldB = objB[sort.field];

      if (!fieldA || !fieldB) {
         return;
      }
      if (fieldA < fieldB) {
         return sort.asc ? -1 : 1;
      } else if (fieldA == fieldB) {
         return 0;
      } else {
         return sort.asc ? 1 : -1;
      }
   }

   useEffect(() => {
      setIsLoading(false);
   }, [todoList]);

   const postTodo = async (todo) => {
      setIsLoading(true);
      const originalItems = [...todoList];
      const response = await TaskService.createTask(todo);
      //TODO manejar mensaje de error
      if (!response.success) {
         setTodoList(originalItems);
         throw Error(response.message);
      }
      addTodo(response.data);
   }

   const addTodo = (newTodo) => {
      setTodoList((previousTodoList) => {
         const newList = [...previousTodoList, newTodo].sort(sortData);
         return newList;
      });
   }

   const updateTodo = async (todo) => {
      setIsLoading(true);

      const originalItems = [...todoList];
      const response = await TaskService.updateTask(todo);
      //TODO manejar mensaje de error
      if (!response.success) {
         setTodoList(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      
      setTodoList((previousTodoList) =>
         previousTodoList.map((item) => {
            return item._id === todo._id ? { ...response.data } : item;
         })
      );
      setIsLoading(false);
   }

   const deleteTodo = async (itemId) => {
      setIsLoading(true);

      const originalItems = [...todoList];
      const response = await TaskService.deleteTask(0, itemId);
      //TODO manejar mensaje de error
      if (!response.success) {
         setTodoList(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      removeTodo(itemId);
      setIsLoading(false);
   }

   const removeTodo = (todoId) => {
      const newTodoList = todoList.filter((item) => item._id != todoId);
      setTodoList(newTodoList);
   }

   return (
      <div>
         <p>Tasks</p>
         {isLoading ? <p>Loading...</p> : <TodoList todoList={todoList} onCheckedItem={updateTodo} onDeleteItem={deleteTodo}/>}
         <AddTodoForm onAddTodo={postTodo} />
      </div>
   );
}
