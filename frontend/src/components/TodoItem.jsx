import PropTypes from 'prop-types';
import { useState, React, useEffect, useRef } from 'react';
import TaskService from '../TaskService';
import AddTodoForm from './AddTodoForm';

export default function TodoItem({ item, toggleHandleByParent, onCheckedItem, onDeleteItem }) {
   const [toggle, setToggle] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [childrenTodoList, setChildrenTodoList] = useState([]);
   const [addTodoChild, setAddTodoChild] = useState(false);
   const divRefAddTodoForm = useRef(null);

   const onToggle = async () => {
      if (!toggle && childrenTodoList.length === 0) {
         await fetchChildrenTasks();
      }
      setToggle((previousState) => !previousState);
   };

   const postTodoChild = async (todo) => {
      setIsLoading(true);

      const originalItems = [...childrenTodoList];
      const response = await TaskService.createTask({ ...todo, parentTask: item._id });
      //TODO manejar mensaje de error
      if (!response.success) {
         setChildrenTodoList(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      addTodo(response.data);
      setAddTodoChild(false);
      setIsLoading(false);
   }

   const addTodo = (newTodo) => {
      setChildrenTodoList((previousTodoList) => {
         const newList = [...previousTodoList, newTodo];
         return newList;
      });
   }
   const updateTodoChild = async (todo) => {
      setIsLoading(true);

      const originalItems = [...childrenTodoList];
      const response = await TaskService.updateTask(todo);
      //TODO manejar mensaje de error
      if (!response.success) {
         setChildrenTodoList(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      setChildrenTodoList((previousTodoList) =>
         previousTodoList.map((item) => {
            return item._id === todo._id ? { ...response.data } : item;
         }
         )
      );
      setIsLoading(false);
   }
   const fetchChildrenTasks = async () => {
      setIsLoading(true);
      const result = await TaskService.getChildrenTasks(item._id);
      //TODO manejo de errores
      if (!result.success) {
         throw json({ message: result.message });
      }
      setChildrenTodoList(result.data);
      setIsLoading(false);
   }

   const deleteTodoChild = async (childId) => {
      setIsLoading(true);

      const originalItems = [...childrenTodoList];
      const response = await TaskService.deleteTask(item._id, childId);
      //TODO manejar mensaje de error
      if (!response.success) {
         setChildrenTodoList(originalItems);
         setIsLoading(false);
         throw Error(response.message);
      }
      deleteTodo(childId);
      setIsLoading(false);
   }

   const deleteTodo = (todoId) => {
      const newTodoList = childrenTodoList.filter((item) => item._id != todoId);
      setChildrenTodoList(newTodoList);
   }
   useEffect(() => {
      const handleFocusOut = (event) => {
         if (!divRefAddTodoForm.current.contains(event.relatedTarget)) {
            setAddTodoChild(false);
         }
      };

      const currentDiv = divRefAddTodoForm.current;
      currentDiv.addEventListener("focusout", handleFocusOut);

      return () => {
         currentDiv.removeEventListener("focusout", handleFocusOut);
      };
   }, []);
   return (
      <div>
         <div hidden={toggleHandleByParent}>
            <button disabled={isLoading} type='button' onClick={onToggle} hidden={!((item.subTasks && item.subTasks.length > 0) || (childrenTodoList && childrenTodoList.length > 0))}>
               toggle
            </button>
            <button disabled={isLoading} type='button' onClick={onCheckedItem}>
               check
            </button>
            <button disabled={isLoading} type='button' onClick={onDeleteItem}>
               delete
            </button>
            <div onDoubleClick={() => setAddTodoChild(true)}>
               {item.completed ? <div style={{ color: "green" }}>Completed</div> : ""}
               <div>
                  {item.title}
               </div>
               <div>
                  {item.dueDate}
               </div>
               <div>
                  {item.priority}
               </div>

               <div hidden={!addTodoChild} tabIndex={"0"} ref={divRefAddTodoForm}>
                  <AddTodoForm onAddTodo={postTodoChild} />
               </div>

            </div>
            <div hidden={!toggle}>
               {isLoading ? <p>Loading...</p> : ""}
               {!isLoading && (childrenTodoList && childrenTodoList.length > 0) && (
                  <>
                     <h4>Subtasks:</h4>
                     {childrenTodoList.map((child) => {
                        return (<TodoItem key={child._id} item={child} hiddenByParent={toggle} onCheckedItem={() => updateTodoChild({ _id: child._id, completed: !child.completed })} onDeleteItem={() => deleteTodoChild(child._id)} />);
                     })}
                  </>
               )}
            </div>
         </div>
         <br />
      </div>
   );
}