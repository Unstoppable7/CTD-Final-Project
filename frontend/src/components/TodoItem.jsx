import PropTypes from 'prop-types';
import { useState, React, useEffect, useRef } from 'react';
import AddTodoForm from './AddTodoForm';
import TodoList from './TodoList';

export default function TodoItem({ item, toggleHandleByParent, onCheckedItem, onDeleteItem, sorter }) {
   const [toggle, setToggle] = useState(false);
   const [addTodoChild, setAddTodoChild] = useState(false);
   const divRefAddTodoForm = useRef(null);

   const onToggle = () => {
      setToggle((previousState) => !previousState);
   };

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
      <div hidden={toggleHandleByParent}>
         <button type='button' onClick={onToggle}>
            toggle
         </button>
         <button type='button' onClick={onCheckedItem}>
            check
         </button>
         <button type='button' onClick={onDeleteItem}>
            delete
         </button>
         <div onDoubleClick={() => { setAddTodoChild(true); setToggle(true) }} >
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
         </div>
         <div tabIndex={"0"} ref={divRefAddTodoForm}>
            <TodoList initialData={[]} parentId={item._id} toggleHandleByParent={!toggle} sorter={sorter} onAddTodoForm={addTodoChild} />
         </div>
      </div>
   );
}